import axios, { AxiosInstance, AxiosPromise } from 'axios'
import { ScalaCriteria } from './entity'

export interface ScalaErrorResponse {
    code: string;
    description: string;
    faultFrom: string;
    httpErrorCode: number;
    validationErrors: ScalaValidationErrorResponse[];
}

export interface ScalaValidationErrorResponse {
    fieldName: string;
    reason: string;
    value: string;
}

export class API {
    /** A private instance of AXIOS */
    private ax: AxiosInstance;

    /**
     * Sets the default parameters for the current axios instance
     *
     * @param baseURL - Defines the baseURL that we'll connect to
     */
    public constructor(baseURL: string) {
        this.ax = axios.create({
            baseURL,
            // timeout: 10000,
            validateStatus: (status) => {
                return status < 500
            }
        })
        this.ax.defaults.headers.post['Accept'] = 'application/json'
        this.ax.defaults.headers.get['Accept'] = 'application/json'
        this.ax.defaults.headers.post['Content-Type'] = 'application/json'
        this.ax.defaults.headers.get['Content-Type'] = 'application/json'

        // this.ax.interceptors.response.use(res => {
        //     // eslint-disable-next-line no-console
        //     console.log(res.request._header)
        //     // eslint-disable-next-line no-console
        //     // console.log(res);
        //     return res;
        // }, error => Promise.reject(error) );

        //   this.ax.interceptors.request.use(config => {
        //     // eslint-disable-next-line no-console
        //     console.log('Request:', config)
        //     return config
        //   }, error => Promise.reject(error))
    }

    public setToken(token: string): void {
        this.ax.defaults.headers.common.apiToken = token
    }

    public getToken(): string {
        return this.ax.defaults.headers.common.apiToken
    }

    public removeToken(): void {
        delete this.ax.defaults.headers.common['apiToken']
    }

    /**
     * Performs a GET action in the provided url. The 
     * expected response will be an R
     * 
     * @typeParam R - Defines the return type
     * 
     * @param url - the endpoint to point the get action
     * @param criteria - optional criteria to get items
     */
    public get<R>(url: string, criteria?: ScalaCriteria): AxiosPromise<R> {
        return this.ax.get(url, {params: criteria})
    }

    /**
     * Performs a POST action in the provided url with the
     * data of type D. The expected response will be of
     * the type provided as R
     * 
     * @typeParam R - Defines the return type
     * 
     * @param url - the endpoint to point the POST action
     * @param data - optional information to send in the POST
     */
    public post<R>(url: string, data?: unknown): AxiosPromise<R> {
        return this.ax.post(url, data)
    }

    /**
   * Performs a PUT action in the provided url with the
   * data of type D. The expected response will be of
   * the type provided as R
   * 
   * @typeParam R - Defines the return type
   * 
   * @param url - the endpoint to point the PUT action
   * @param data - optional information to send in the PUT
   */
    public put<R>(url: string, data: unknown): AxiosPromise<R> {
        return this.ax.put(url, data)
    }

    /**
   * Performs a DELETE action in the provided url
   * 
   * @typeParam R - Defines the return type
   * @param url - the endpoint to point the PUT action
   */
    public delete<R>(url: string): AxiosPromise<R> {
        return this.ax.delete(url)
    }
}

export default API
