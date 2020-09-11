import { AxiosResponse } from 'axios'
import { API  } from './api'
// import { Tags } from './tags'
// import { DisplayGroups } from './displayGroups'
// import { Displays } from './displays'
// import { Schedules } from './schedules'
// import { CMSResponse } from './entity'
// import { Playlists } from './playlists'
// import { Layouts } from './layouts'
// import { Medias } from './medias'
// import { Permissions } from './permissions'
// import { Widgets } from './widgets'

interface ScalaCredentials {
    /** username */
    username: string;

    /** password */
    password: string;
}

interface ScalaDTO extends ScalaCredentials {
    /** Scala CMS url */
    url: string;
}

interface ScalaLoginResponse {
    status: string;
    apiToken: string;
    version: number;
    user: {
        id: number;
        username: string;
        firstname: string;
        lastname: string;
        emailaddress: string;
        dateFormat: string;
        timeFormat: string;
        name: string;
        language: string;
        languageCode: string;
        lastLogin: string; // '2019-05-28 19:47:00',
        canChangePassword: boolean;
        forcePasswordChange: boolean;
        workgroup?: string;
        isSuperAdministrator: boolean;
        isAutoMediaApprover: boolean;
        isAutoMessageApprover: boolean;
        receiveEmailAlerts: boolean;
        isWebserviceUser: boolean;
        enabled: boolean;
        receiveApprovalEmails: boolean;
        authenticationMethod: string;
        passwordLastChanged: string; // '2016-06-14 16:08:01',
    };
    resources: string[];
}

export interface ScalaDef {
    // tags: Tags;
    // displaygroups: DisplayGroups;
    // displays: Displays;
    // schedules: Schedules;
    // playlists: Playlists;
    // layouts: Layouts;
    // medias: Medias;
    // permissions: Permissions;
    // widgets: Widgets
}

export class Scala implements ScalaDef {
    private credentials: ScalaCredentials;
    public api: API;
    // public tags: Tags;
    // public displaygroups: DisplayGroups
    // public displays: Displays
    // public schedules: Schedules
    // public playlists: Playlists
    // public layouts: Layouts
    // public medias: Medias
    // public permissions: Permissions
    // public widgets: Widgets

    public constructor({ url, ...credentials }: ScalaDTO) {
        this.api = new API(url)
        this.credentials = {
            ...credentials,
        }

        // this.tags = new Tags(this)
        // this.displaygroups = new DisplayGroups(this)
        // this.displays = new Displays(this)
        // this.schedules = new Schedules(this)
        // this.playlists = new Playlists(this)
        // this.layouts = new Layouts(this)
        // this.medias = new Medias(this)
        // this.permissions = new Permissions(this)
        // this.widgets = new Widgets(this)
    }

    /**
     * Authenticate in the server with the credentials
     * provided in the class constructor
     */
    public async login(): Promise<boolean> {
        if (this.api.getToken()) return true

        const endPoint = '/cm/api/rest/auth/login'
        
        const resp = await this.api.post<
            ScalaLoginResponse,
            ScalaCredentials
        >(endPoint, this.credentials)

        if (resp.status === 200) {
            if (resp.data.status === 'login.success') {
                this.api.setToken(resp.data.apiToken)
                return true
            }
        }
        this.threatError(resp)
    }


    /**
     * 
     */
    public async logout(): Promise<boolean> {
        if (!this.api.getToken()) return true

        const endPoint = '/cm/api/rest/auth/logout'
        
        const resp = await this.api.post<ScalaLoginResponse>(endPoint)

        if (resp.status === 200) {
            this.api.removeToken()
            return true
        }
        this.threatError(resp)
    }


    /**
     * Throw errors based on the axios response
     * 
     * @param resp - The failed axios response 
     */
    private threatError(resp: AxiosResponse): never {
        if (resp.data.message) throw new Error(resp.data.message)
        throw new Error(resp.statusText)
    }
}
