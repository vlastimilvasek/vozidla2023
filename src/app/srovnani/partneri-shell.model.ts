import { IPartner, Partner } from '../core/models';

export class PartneriShellModel {
    partneri: IPartner[] = [
        new Partner(),
        new Partner(),
        new Partner(),
        new Partner(),
        new Partner(),
    ];

    constructor(readonly isShell: boolean) { }
}
