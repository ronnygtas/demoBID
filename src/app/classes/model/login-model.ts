export class LoginModel {
    public resultOK: boolean;
    public errorMessage: string;
    public message: string;
    public token: string;
    public user: number;
    public person: number;
    public name: string;
    public middleName: string;
    public lastname: string;
    public profile: Profile;
    public permissions: string[];
    public result: boolean;
    public biometricEnrollment: BiometricEnrollment;
    public uToken: string;
}

export class BiometricEnrollment {
    requiredFinger: boolean;
    requiredFacial: boolean;
    fingerOk: boolean;
    facialOk: boolean;
}

export class Profile{
    public name: string;
    public permissions: Permission[];
}

export class Permission{
    public id: number;
    public name: string;
}