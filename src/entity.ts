/* eslint-disable no-undef */
import { Scala } from './Scala'
import { AxiosResponse } from 'axios'
import { ScalaErrorResponse } from './api'

export interface ScalaUpdateResponse {
    value: string;
}

/**
 * Interface used to define a criteria for filtering/searching/getting
 * a list of Scala entities
 */
export interface ScalaCriteria {
    /** Limit search result. Maximum is 1000 items */
    limit: number;

    /** The first index to perform the search. Use for pagination */
    offset?: number;

    /** Comma separated list of fields to sort by. Use - sign (minus sign)
     * to identify the column should be sort by descending order.
     */
    sort?: string;

    // listOnly?: boolean;

    /** A comma separated list of fields you want to include on the response object.
     * Note: The field ID always be included as part of the response object
     */
    fields?: string;

    /** One or more filters to be applied with the following comparators:
     * eq (=), ne (!=), ge (\>=), le (\<=), gt (\>), lt (\<), in, like
     * @example `{name : {values:['test%', '%xmas%'], comparator : 'like'}}`
     */
    filters?: Record<string, unknown>;

    /** A string that the user wants to search for.
     * The system will search for media items with names or descriptions
     * containing that string.
     */
    search?: string;
}

/**
 * A common interface for List Responses of Scala components
 */
export interface ScalaList<R> {
    /** List of items of type R */
    list: R[];

    /** Offset of the results. It's the same value of the offset passed on
     * from request parameter
     */
    offset: number;

    /** Total records without any filtering/limits */
    count: number;
}

/** A personalized response interface for the list methods, that
 * extends the ScalaListResponse and adds to it the currentPage, totalPages and
 * isLastPage properties, defined by the current limit and a method (nextPage) to
 * navigate between pages.
 */
export interface CMResponse<R> extends ScalaList<R> {
    /** Shows the current page based on limit items defined on criteria */
    currentPage: number;

    /** Shows the totalPages of items, based on limit */
    totalPages: number;

    /** Defines if current page is the last page of the set */
    isLastPage: boolean;

    /** A method to navigate between pages of the resultset */
    nextPage?: () => Promise<CMResponse<R>>;
}


/**
 * An abstract class to share methods and properties between
 * all the Xibo components available.
 * To instantiate it is necessary to supply 3 types:
 * @typeparam R - Defines the return type of the get, list, insert and update methods
 * @typeparam I - Defines the type of the argument for the insert method
 * @typeparam U - Defines the return type of getUsage method
 */
export abstract class Entity<R, I, U> {

    protected server: Scala;

    protected endpoint: string;

    public constructor(server: Scala, endPoint: string) {
        this.server = server
        this.endpoint = endPoint
    }

    /**
     * Mount the response to uSign, in the desired format
     * 
     * @param resp - a response from axios
     */
    private mountScalaResponse(resp: ScalaList<R>, crit: ScalaCriteria): CMResponse<R> {
        const currentPage = Math.floor(resp.offset / crit.limit) + 1
        const totalPages = Math.floor(resp.count / crit.limit) + 1
        const isLastPage = totalPages === currentPage
        const newCriteria = {
            ...crit,
            offset: resp.offset + crit.limit
        }

        return {
            list: resp.list,
            offset: resp.offset,
            count: resp.count,
            totalPages,
            currentPage,
            isLastPage,
            nextPage: !isLastPage
                ? async () => {
                    return this.list(newCriteria)
                }
                : undefined,
        }
    }


    /**
     * Some Xibo API methods returns data that require
     * transformations to be used. This method must be override 
     * to allow correct transformations, otherwise it just
     * returns the data supplied
     * 
     * @param data - the data to be transformed
     */
    mount(entity: R): R {
        return entity
    }


    /**
     * Gets all the information about the component of type T
     * @param id - index of component desired to get information
     * @typeparam R - Defines the return type of the get, list, insert and update methods
     */
    async get(id: number): Promise<R> {
        const url = `${this.endpoint}/${id}`
        const resp = await this.server.api.get<R & ScalaErrorResponse>(url)
        if (resp.status === 200) {
            return this.mount(resp.data)
        }
        this.dealWithError(resp)
    }


    async getUsage(id: number): Promise<U> {
        const url = `${this.endpoint}/usage?ids=${id}`
        const resp = await this.server.api.get<U & ScalaErrorResponse>(url)
        if (resp.status === 200) {
            return resp.data
        }
        this.dealWithError(resp)
    }


    /**
     * Request api to perform a get in the supplied endPoint
     * 
     * All responses from Xibo are expected to be of type
     * CMSResponse because it always has the envelope mode 
     * enabled. The data in the CMSResponse if of type R
     * 
     * The return is an object of type USignResponse<R>
     * 
     * @param criteria - the criteria to search the data
     * @param endPoint - the default endPoint is defined in the constructor
     *                   but if needed could be passed another
     */
    public async list(criteria?: ScalaCriteria, endPoint?: string): Promise<CMResponse<R>> {
        const ep = endPoint || this.endpoint
        const crit = criteria || { limit: 10 }
        const resp = await this.server.api.get<ScalaList<R> & ScalaErrorResponse>(ep, crit)

        if (resp.status === 200) {
            return this.mountScalaResponse(resp.data, crit)
        }
        this.dealWithError(resp)
    }


    /**
     * Request api to perform an insert in the supplied endPoint
     * 
     * All responses from Xibo are expected to be of type
     * CMSResponse because it always has the envelope mode 
     * enabled. The data in the CMSResponse if of type R
     * 
     * The return is an object of type R
     * 
     * @param content - the component data to insert
     */
    public async insert(content: I, endPoint?: string): Promise<R> {
        const ep = endPoint || this.endpoint
        const resp = await this.server.api.post<R & ScalaErrorResponse>(ep, content)
        if (resp.status === 200) {
            return this.mount(resp.data)
        }
        this.dealWithError(resp)
    }


    /**
     * Request api to perform an update in the supplied endPoint
     * 
     * All responses from Xibo are expected to be of type
     * CMSResponse because it always has the envelope mode 
     * enabled. The data in the CMSResponse if of type R
     * 
     * The return is an object of type R
     * 
     * @param id - the component ID to update
     * @param content - the complete component data to update, XiboCMS
     *                  always expect all data to update the component
     *                  not only the data updated
     */
    public async update(id: number, content: unknown): Promise<R> {
        const url = `${this.endpoint}/${id}`
        const resp = await this.server.api.put<R & ScalaErrorResponse & ScalaUpdateResponse>(url, content)
        if (resp.status === 200) {
            if (resp.data.value) {
                console.log('Responde Data [Update]:', resp.data)
                if (resp.data.value.toUpperCase() === 'DONE') {
                    return this.get(id)
                }
            } else if (resp.data) {
                return resp.data
            }
        }
        this.dealWithError(resp)
    }


    /**
     * Request api to perform a delete in the supplied endPoint
     * 
     * All responses from Xibo are expected to be of type
     * CMSResponse because it always has the envelope mode 
     * enabled. The data in the CMSResponse if of type R
     * 
     * @param id - the component ID to remove
     */
    public async remove(id: number, content?: Record<string, unknown>): Promise<boolean> {
        const url = content ? `${this.endpoint}/` : `${this.endpoint}/${id}`
        const resp = await this.server.api.delete<ScalaErrorResponse>(url)
        if (resp.status === 204) {
            return true
        }
        this.dealWithError(resp)
    }


    /**
     * Throw errors based on the axios response
     * 
     * @param resp - The failed axios response 
     */
    protected dealWithError(resp: AxiosResponse): never {
        console.log('Error:', resp.data.status)
        if (resp.data.status) throw new Error(resp.data.status)
        throw new Error(resp.statusText)
    }
}

