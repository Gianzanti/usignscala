export interface WorkgroupToInsertMedia {
    id: number;
    owner: boolean;
}

export interface MediaInsert {
    name: string;
    uri: string;
    mediaType: 'HTML';
    workgroups: WorkgroupToInsertMedia[];
}

export interface Media extends MediaInsert {
    id: number;
    description?: string;
    lastModified?: string;
    downloadPath?: string;
    // workgroups?: Workgroup[];
    audioDucking?: boolean;
    playFullscreen?: boolean;
    width?: number;
    height?: number;
    duration?: number;
    volume?: number; // 0 - 255
    approvalStatus?: string;
    createdDate?: string;
    startValidDate?: string;
    length?: number;
    revision?: number;
    // uploadedBy?: IUser;
    // modifiedBy?: IUser;
}

