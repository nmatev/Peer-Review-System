import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { NotificatorService } from './notificator.service';

describe('NotificatorService', () => {
    const notificator = jasmine.createSpyObj('NotificatorService', ['success', 'error']);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: NotificatorService,
                    useValue: notificator,
                },
            ]

        });
    });

    it('service should be defined', () => {
        const service: NotificatorService = TestBed.get(NotificatorService);

        expect(service).toBeTruthy();
    });

    it('service should call notificator error', () => {
        const service: NotificatorService = TestBed.get(NotificatorService);

        service.error('test');
        expect(service.error).toHaveBeenCalledTimes(1);
    });

    it('service should call success error', () => {
        const service: NotificatorService = TestBed.get(NotificatorService);

        service.success('test');
        expect(service.error).toHaveBeenCalledTimes(1);
    });

});
