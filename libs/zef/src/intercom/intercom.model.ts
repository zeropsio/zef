export interface BootInput {
  custom_launcher_selector?: string;
  user_id?: string;
  email?: string;
  /**
   * If no app_id is passed, the value on config will be used
   */
  app_id?: string;
  [propName: string]: any;
}

export interface IntercomConfig {
  /**
   * Your intercom App ID
   */
  app_id: string

  /**
   * Customize left or right position of messenger
   */
  alignment?: 'left' | 'right'

  /**
   * Customize horizontal padding
   */
  horizontal_padding?: number

  /**
   * Customize vertical padding
   */
  vertical_padding?: number

  /**
   * arbitrarily localize your intercom messenger
   */
  language_override?: string
}
