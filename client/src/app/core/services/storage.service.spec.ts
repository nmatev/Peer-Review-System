import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({});

        let store = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            }
        };

        spyOn(localStorage, 'getItem')
            .and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem')
            .and.callFake(mockLocalStorage.setItem);
        spyOn(localStorage, 'removeItem')
            .and.callFake(mockLocalStorage.removeItem);
        spyOn(localStorage, 'clear')
            .and.callFake(mockLocalStorage.clear);
    });
    it('set should call localStorage.setItem() and save the key and value', () => {
        const service: StorageService = TestBed.get(StorageService);

        service.set('key', 'value');
        const result = service.get('key');
        expect(result).toEqual('value');
    });

    it('get should call localStorage.getItem() and return the right value', () => {
        const service: StorageService = TestBed.get(StorageService);

        // it is null because we are mocking it;
        const result = service.get('key');
        expect(result).toEqual(null);
    });
});
