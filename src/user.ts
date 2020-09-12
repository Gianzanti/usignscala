export interface User {
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
    lastLogin: string;
    canChangePassword: boolean;
    forcePasswordChange: boolean;
    isSuperAdministrator: boolean;
    isAutoMediaApprover: boolean;
    isAutoMessageApprover: boolean;
    receiveEmailAlerts: boolean;
    isWebserviceUser: boolean;
    enabled: boolean;
    receiveApprovalEmails: boolean;
    authenticationMethod: string;
    passwordLastChanged: string;
}

export interface UserProperties {
    id: number;
    name: string;
    value: string;
}