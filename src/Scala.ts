import { AxiosResponse } from 'axios'
import { API } from './api'
import { Network } from './network'
import { User, UserProperties } from './user'
import { Playlists } from './playlists'

interface ScalaCredentials {
    /** username */
    username: string

    /** password */
    password: string
}

interface ScalaServerTime {
    timestamp: number
    datetime: string
    gtmDatetime: string
    gtmTimestamp: number
    localDatetime: string
}

interface ScalaLoginResponse {
    status?: string
    apiToken?: string
    version?: number
    user?: User
    userProperties?: UserProperties[]
    resources?: string[]
    lastLogonToNetworkId?: number
    token?: string
    apiLicenseToken?: string
    keepAlive?: true
    licenses?: string[]
    serverTime?: ScalaServerTime
    ldapEnabled?: false
    network?: Network
}

export interface ScalaDef {
    playlists: Playlists
}

export class Scala implements ScalaDef {
    private credentials: ScalaCredentials
    private properties: ScalaLoginResponse
    public api: API
    public playlists: Playlists

    public constructor(url: string, username: string, password: string) {
        this.api = new API(`${url}/cm/api/rest/`)
        this.credentials = {
            username,
            password,
        }
        this.properties = {}
        this.playlists = new Playlists(this)
    }

    /**
     * Authenticate in the server with the credentials
     * provided in the class constructor
     */
    public async login(): Promise<boolean> {
        if (this.api.getToken()) return true

        const endPoint = 'auth/login'
        const resp = await this.api.post<ScalaLoginResponse>(
            endPoint,
            this.credentials,
        )

        if (resp.status === 200) {
            if (resp.data.status === 'login.success') {
                this.properties = resp.data
                if (resp.data.apiToken) {
                    this.api.setToken(resp.data.apiToken)
                    return true
                }
            }
        }
        this.threatError(resp)
    }

    /**
     *
     */
    public async logout(): Promise<boolean> {
        if (!this.api.getToken()) return true

        const endPoint = 'auth/logout'
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
        if (resp.data.status) throw new Error(resp.data.status)
        throw new Error(resp.statusText)
    }
}
