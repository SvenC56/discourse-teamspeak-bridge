import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AssignmentService } from 'src/assignment/assignment.service';
import { DiscourseService } from 'src/discourse/discourse.service';
import { TeamspeakService } from 'src/teamspeak/teamspeak.service';
// Lodash
import { difference, intersectionWith, isEmpty, isEqual } from 'lodash';
import { TeamSpeakClient } from 'ts3-nodejs-library';
import { DiscourseUser } from 'src/discourse/discourse-user.interface';
import { CompareUsergroupsResponse } from './interface/compare-usergroups-response.interface';
import { FilterAssignedGroups } from './interface/filter-assigned-groups.interface';
import { Cron } from '@nestjs/schedule';
import { Assignment } from '.prisma/client';

/**
 * Synchronisation service
 *
 * @export
 * @class SyncService
 */
@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @Inject(forwardRef(() => TeamspeakService))
    private readonly teamspeakService: TeamspeakService,
    private readonly discourseService: DiscourseService,
    private readonly assignmentService: AssignmentService,
  ) {}

  /**
   * Synchronisation every 5 minutes
   *
   * @return {*}  {Promise<any>}
   * @memberof SyncService
   */
  @Cron('*/5 * * * *')
  private async handleCron(): Promise<any> {
    return this.compareAllUsers();
  }

  /**
   * Compares a single user with assignments from the database
   *
   * @param {TeamSpeakClient} teamspeakClient
   * @return {*}  {Promise<any>}
   * @memberof SyncService
   */
  async compareSingleUser(teamspeakClient: TeamSpeakClient): Promise<any> {
    const discourseUsers = await this.discourseService.getUsers();
    const assignments = await this.assignmentService.getAssignments();

    const result = await this.compareUsergroups(
      teamspeakClient,
      discourseUsers,
      assignments,
    );
    return this.handleTeamSpeakAction(teamspeakClient, assignments, result);
  }

  /**
   * Compares all users with assignments from the database
   *
   * @return {*}  {Promise<any>}
   * @memberof SyncService
   */
  async compareAllUsers(): Promise<any> {
    const teamspeakUsers = await this.teamspeakService.clientList();
    const discourseUsers = await this.discourseService.getUsers();
    const assignments = await this.assignmentService.getAssignments();

    await this.asyncForEach(
      teamspeakUsers,
      async (teamspeakClient: TeamSpeakClient) => {
        const result = await this.compareUsergroups(
          teamspeakClient,
          discourseUsers,
          assignments,
        );
        return this.handleTeamSpeakAction(teamspeakClient, assignments, result);
      },
    );
  }

  /**
   * Get server groups to be added or removed from user in TeamSpeak
   *
   * @private
   * @param {TeamSpeakClient} teamspeakClient
   * @param {DiscourseUser[]} discourseUsers
   * @param {Assignment[]} assignments
   * @return {*}  {Promise<CompareUsergroupsResponse>}
   * @memberof SyncService
   */
  private async compareUsergroups(
    teamspeakClient: TeamSpeakClient,
    discourseUsers: DiscourseUser[],
    assignments: Assignment[],
  ): Promise<CompareUsergroupsResponse> {
    // Returns all Discourse groups the user belongs to; undefined if not synced with system
    const onlineAssignedUser = discourseUsers.filter((element) => {
      return element.teamspeak_uid === teamspeakClient.uniqueIdentifier;
    });

    // Transform Discourse usergroup object to number array
    const discourseUserGroups: number[] = onlineAssignedUser.map(
      (element) => element.user_group,
    );

    // Filter in which Discourse Usergroup the user is part of
    const { isInSg, isNotInSg } = this.filterAssignedGroups(
      assignments,
      discourseUserGroups,
    );

    // The TeamSpeak API returns a string array. We need a number array
    const teamspeakServerGroups: number[] = this.transformSgArray(
      teamspeakClient.servergroups,
    );

    // The server groups which have to be added in teamspeak
    const syncAdd = difference(isInSg, teamspeakServerGroups);

    // The server groups which have to be removed in teamspeak
    const syncRemove = intersectionWith(
      isNotInSg,
      teamspeakServerGroups,
      isEqual,
    );

    return {
      syncAdd,
      syncRemove,
    };
  }

  /**
   * Get the filtered user groups which the user is part of
   *
   * @private
   * @param {Assignment[]} assignmentTable
   * @param {number[]} discourseUserGroups
   * @return {*}  {FilterAssignedGroups}
   * @memberof SyncService
   */
  private filterAssignedGroups(
    assignmentTable: Assignment[],
    discourseUserGroups: number[],
  ): FilterAssignedGroups {
    const isInSg: number[] = [];
    const isNotInSg: number[] = [];

    assignmentTable.forEach((element) => {
      if (discourseUserGroups.includes(element.dcid)) {
        return isInSg.push(element.tsid);
      }
      if (element.shield === true) {
        return isNotInSg.push(element.tsid);
      }
    });

    return {
      isInSg,
      isNotInSg,
    };
  }

  /**
   * Add or remove user groups from user in TeamSpeak; Writes a personalized message to the user.
   *
   * @private
   * @param {TeamSpeakClient} teamspeakClient
   * @param {Assignment[]} assignments
   * @param {CompareUsergroupsResponse} result
   * @return {*}  {Promise<any>}
   * @memberof SyncService
   */
  private async handleTeamSpeakAction(
    teamspeakClient: TeamSpeakClient,
    assignments: Assignment[],
    result: CompareUsergroupsResponse,
  ): Promise<any> {
    // No changes
    if (isEmpty(result.syncAdd) && isEmpty(result.syncRemove)) {
      return;
    }

    if (!isEmpty(result.syncAdd)) {
      await this.teamspeakService.addClientServerGroup(
        teamspeakClient,
        result.syncAdd,
      );
    }

    if (!isEmpty(result.syncRemove)) {
      await this.teamspeakService.removeClientServerGroup(
        teamspeakClient,
        result.syncRemove,
      );
    }

    let message = `User '${teamspeakClient.nickname}' was`;

    if (!isEmpty(result.syncAdd)) {
      const addGroupNames = this.getGroupNames(result.syncAdd, assignments);
      message += ` added to TeamSpeak Server Groups: '${addGroupNames.join(
        ', ',
      )}'`;
    }
    if (!isEmpty(result.syncRemove)) {
      const removeGroupNames = this.getGroupNames(
        result.syncRemove,
        assignments,
      );
      if (!isEmpty(result.syncAdd)) {
        message += ' and';
      }
      message += ` removed from ${
        !isEmpty(result.syncAdd) ? '' : 'TeamSpeak Server Groups'
      }: '${removeGroupNames.join(', ')}'`;
    }
    this.logger.log(message);
    return this.teamspeakService.sendClientTextMessage(
      teamspeakClient,
      message,
    );
  }

  /**
   * Transform a string array to a number array
   *
   * @private
   * @param {string[]} sgArray
   * @return {*}  {number[]}
   * @memberof SyncService
   */
  private transformSgArray(sgArray: string[]): number[] {
    return sgArray.map((sg) => {
      return parseInt(sg, 10);
    });
  }

  /**
   * ToDo: Change to For...of Loop
   *
   * @private
   * @param {any[]} array
   * @param {function} callback
   * @return {*}  {Promise<any>}
   * @memberof SyncService
   */
  private async asyncForEach(array: any[], callback): Promise<any> {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  /**
   * Get server group names from assignments by TeamSpeak SG ID
   *
   * @private
   * @param {number[]} sgArray
   * @param {Assignment[]} assignments
   * @return {*}  {string[]}
   * @memberof SyncService
   */
  private getGroupNames(
    sgArray: number[],
    assignments: Assignment[],
  ): string[] {
    const result: string[] = [];
    assignments.forEach((element) => {
      if (sgArray.includes(element.tsid)) {
        return result.push(element.name);
      }
    });
    return result;
  }
}
