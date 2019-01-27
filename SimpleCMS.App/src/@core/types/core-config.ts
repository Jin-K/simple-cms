export interface CoreConfig {
  stsServer?:                                   string;
  redirect_url?:                                string;
  client_id?:                                   string;
  response_type?:                               'code' | 'token' | 'id_token' | 'id_token token' | 'code id_token' | 'code token' | 'code id_token token' | 'none';
  scope?:                                       string;
  post_logout_redirect_uri?:                    string;
  start_checksession?:                          boolean;
  silent_renew?:                                boolean;
  startup_route?:                               string;
  forbidden_route?:                             string;
  unauthorized_route?:                          string;
  log_console_warning_active?:                  boolean;
  'log_console.debug_active'?:                  boolean;
  max_id_token_iat_offset_allowed_in_seconds?:  number;
  apiServer:                                    string;
}
