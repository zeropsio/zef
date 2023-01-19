import {
  Inject,
  Injectable,
  PLATFORM_ID,
  Optional,
  isDevMode,
  Renderer2,
  RendererFactory2,
  ViewEncapsulation
} from '@angular/core'
import { filter } from 'rxjs/operators'
import { Router, NavigationEnd } from '@angular/router'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { IntercomConfig } from './intercom-config.service';
import { BootInput } from './intercom.model';

/**
 * A provider with every Intercom.JS method
 */
@Injectable({ providedIn: 'root' })
export class Intercom {

  private _id: string;
  private _renderer2: Renderer2;

  constructor(
    @Inject(IntercomConfig)
    private _config: IntercomConfig,
    @Inject(PLATFORM_ID)
    protected _platformId: any,
    @Optional()
    @Inject(Router)
    private _router: Router,
    private _rendererFactory: RendererFactory2,
    @Optional() @Inject(DOCUMENT)
    private _document: any // Document
  ) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    this._renderer2 = this._rendererFactory.createRenderer(this._document, {
      id: '-1',
      encapsulation: ViewEncapsulation.None,
      styles: [],
      data: {}
    });

    // Subscribe to router changes
    if (_config && _config.updateOnRouterChange) {
      this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((_) => {
        this.update();
      });
    } else if (isDevMode()) {
      console.warn(`
      Common practice in single page applications is to update whenever the route changes.
      ng-intercom supports this functionality out of the box just set 'updateOnRouterChange' to true in your Intercom Module config.
       This warning will not appear in production, if you choose not to use router updating.
     `);
    }
  }

  /**
   * If you'd like to control when Intercom is loaded, you can use the 'boot' method.
   * This is useful in situations like a one-page Javascript based application where the user may not be logged in
   * when the page loads. You call this method with the standard intercomSettings object.
   */
  boot(intercomData?: BootInput) {

    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    const app_id = intercomData.app_id ? intercomData.app_id : this._config.appId

    // Run load and attach to window
    this.loadIntercom(this._config, (_?: Event) => {
      // then boot the intercom js
      const data = {
        ...intercomData,
        app_id
      };

      return this._callIntercom('boot', data);
    });
  }

  /**
   * If you have the Respond product (combined with another product like Engage)
   * you should call the Intercom shutdown method to clear your users’ conversations anytime they logout
   * of your application. Otherwise, the cookie we use to track who was most recently logged in on a given device
   * or computer will keep these conversations in the Messenger for one week.
   * This method will effectively clear out any user data that you have been passing through the JS API.
   */
  shutdown() {
    return this._callIntercom('shutdown');
  }

  /**
   * Calling the update method without any other arguments will trigger the JavaScript to look for new messages
   * that should be displayed to the current user (the one whose details are in the window.intercomSettings variable)
   * and show them if they exist.
   *
   * Calling the update method with a JSON object of user details will update those fields on the current user
   * in addition to logging an impression at the current URL and looking for new messages for the user.
   */
  update(data?: any) {
    return this._callIntercom('update', data);
  }

  /**
   * This will hide the main Messenger panel if it is open. It will not hide the Messenger Launcher.
   */
  hide() {
    return this._callIntercom('hide');
  }

  /**
   * This will show the Messenger. If there are no conversations it will open with the new message view,
   * if there are it will open with the message list.
   *
   * If a `message` parameter is supplied, it will automatically open a new message window, aliasing showNewMessage().
   *
   */
  show(message?: string) {
    if (message) {
      return this.showNewMessage(message);
    }
    return this._callIntercom('show');
  }

  /**
   * To open the message window with the message list you can call `showMessages()`.
   */
  showMessages() {
    return this._callIntercom('showMessages');
  }

  /**
   * To open the message window with the new message view you can call showNewMessage().
   *
   * This function takes an optional parameter that can be used to pre-populate the message composer as shown below.
   */
  showNewMessage(message?: string) {
    return this._callIntercom('showNewMessage', message);
  }

  /**
   * You can submit an event using the trackEvent method.
   * This will associate the event with the currently logged in user and send it to Intercom.
   * The final parameter is a map that can be used to send optional metadata about the event.
   *
   * You can also add custom information to events in the form of event metadata.
   */
  trackEvent(eventName: string, metadata?: any) {
    return this._callIntercom('trackEvent', eventName, metadata);
  }

  /**
   * A visitor is someone who goes to your site but does not use the messenger.
   * You can track these visitors via the visitor user_id.
   * This user_id can be used to retrieve the visitor or lead through the REST API.
   */
  getVisitorId(): string {
    return this._callIntercom('getVisitorId');
  }

  /**
   * Alias for getVisitorId()
   * @alias getVisitorId()
   * @readonly
   */
  get visitorId(): string {
    return this._callIntercom('getVisitorId');
  }

  /**
   * Gives you the ability to hook into the show event. Requires a function argument.
   */
  onShow(handler: () => void) {
    return this._callIntercom('onShow', handler);
  }

  /**
   * Gives you the ability to hook into the hide event. Requires a function argument.
   */
  onHide(handler: () => void) {
    return this._callIntercom('onHide', handler);
  }

  /**
   * This method allows you to register a function that will be called when the current number of unread messages changes.
   */
  onUnreadCountChange(handler: (unreadCount?: number) => void) {
    return this._callIntercom('onUnreadCountChange', handler);
  }

  /**
   * If you would like to trigger a tour based on an action a user or visitor takes in your site or application,
   * ou can use this API method. You need to call this method with the id of the tour you wish to show. The id of
   * the tour can be found in the “Use tour everywhere” section of the tour editor.
   *
   * Please note that tours shown via this API must be published and the “Use tour everywhere” section must be
   * turned on. If you're calling this API using an invalid tour id, nothing will happen.
   */
  startTour(tourId: number) {
    return this._callIntercom('startTour', tourId);
  }

  /**
   * Private handler to run Intercom methods safely
   */
  private _callIntercom(fn: string, ...args: any[]) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    if ((<any>window).Intercom) {
      return (<any>window).Intercom(fn, ...args);
    }
    return;
  }

  injectIntercomScript(conf: IntercomConfig, afterInjectCallback: (ev: Event) => any) {

    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    // Set the window configuration to conf
    (<any>window).intercomSettings = conf;

    // Create the intercom script in document
    const s = this._document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = `https://widget.intercom.io/widget/${this._id}`;

    if ((s as any).attachEvent) {
      (s as any).attachEvent('onload', afterInjectCallback);
    } else {
      s.addEventListener('load', afterInjectCallback, false);
    }

    if (this._renderer2 && this._renderer2.appendChild) {
      this._renderer2.appendChild(this._document.head, s);
    }

    (<any>window).Intercom('update', conf);
  }

  loadIntercom(config: IntercomConfig, afterLoadCallback: (ev?: Event) => any) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    this._id = config.appId;
    const w = <any>window;
    const ic = w.Intercom;

    // Set window config for Intercom
    w.intercomSettings = config;

    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', config);
      afterLoadCallback();
    } else {
      const i: any = function () {
        // eslint-disable-next-line prefer-rest-params
        i.c(arguments);
      }
      i.q = [];
      i.c = function (args: any) {
        i.q.push(args);
      }
      w.Intercom = i;
      this.injectIntercomScript(config, afterLoadCallback);
    }

  }
}
