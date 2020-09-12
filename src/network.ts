export interface Network {
    id: number;
    name: string;
    approvalMessage: boolean;
    approvalMedia: boolean;
    firstDay: string;
    maxDownloadThreads: number;
    smtpServerAddress: string;
    senderEmailAddress: string;
    smtpPort: number;
    smptpSsl: boolean;
    smtpUsername: string;
    active: boolean;
    licenseState: string;
    newsFeed: boolean;
    viewReport: boolean;
    maxDatabaseAge: number;
    smtpEnabled: boolean;
    sessionTimeout: number;
    userPasswordExpiresIn: number;
    userPasswordExpiresInMinutes: boolean;
    smtpAuthentication: boolean;
    autoThumbnailGeneration: boolean;
    automaticPlaylistDurationCalculation: boolean;
    purgeDaysPlanGenHistory: number;
    showMessageFieldsInMultiplePages: boolean;
}