import { HttpService, Injectable, Logger } from '@nestjs/common';
import { DiscourseConfigService } from 'src/config/discourse/config.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { stringify } from 'querystring';

@Injectable()
export class DiscourseService {
  private readonly logger = new Logger(DiscourseService.name);

  constructor(
    private readonly discourseConfig: DiscourseConfigService,
    private httpService: HttpService,
  ) {}

  getGroups(): Observable<AxiosResponse<any>> {
    try {
      return this.httpService
        .get(`${this.discourseConfig.url}/groups.json`)
        .pipe(map((response) => response.data.groups));
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  getUsers(): Observable<AxiosResponse<any>> {
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
      return this.httpService
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
        );
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
