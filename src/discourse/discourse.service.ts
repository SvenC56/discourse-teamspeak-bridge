import { HttpService, Injectable, Logger } from '@nestjs/common';
import { DiscourseConfigService } from 'src/config/discourse/config.service';
import { map } from 'rxjs/operators';
import { stringify } from 'querystring';
import { DiscourseUser } from './discourse-user.interface';
import { DiscourseGroup } from './interface/discourse-group.interface';

@Injectable()
export class DiscourseService {
  private readonly logger = new Logger(DiscourseService.name);

  constructor(
    private readonly discourseConfig: DiscourseConfigService,
    private httpService: HttpService,
  ) {}

  async getGroups(): Promise<DiscourseGroup[]> {
    try {
      const response: DiscourseGroup[] = await this.httpService
        .get(`${this.discourseConfig.url}/groups.json`)
        .pipe(map((response) => response.data.groups))
        .toPromise();
      const groups = response;
      return groups;
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getUsers(): Promise<DiscourseUser[]> {
    const requestBody = stringify({
      params: `{ "custom_field_name" : "${this.discourseConfig.custom_field_name}" }`,
    });

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'Api-Key': this.discourseConfig.api_key,
        'Api-Username': this.discourseConfig.user,
      },
    };

    try {
      const response: DiscourseUser[] = await this.httpService
        .post(
          `${this.discourseConfig.url}/admin/plugins/explorer/queries/${this.discourseConfig.user_list_query_id}/run`,
          requestBody,
          config,
        )
        .pipe(
          map((response) => {
            return response.data.rows.map((user) => ({
              user_id: user[0],
              name: user[1],
              user_group: user[2],
              teamspeak_uid: user[3],
            }));
          }),
        )
        .toPromise();
      return response;
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
