import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isPlainObject from 'lodash/isPlainObject';
import _merge from 'lodash/merge';
import _omit from 'lodash/omit';

import { debugLog } from '../General';
import {
    GLOBAL_WINDOW,
    HolderObject,
} from '../types';

interface LocalDataInterface {
    get: (key: string) => any;
    add: (data: object) => object;
    update: (data: object) => object;
    put: (data: object, key?: string) => object;
    remove: (key: string) => object;
    destroy: () => void; 
    setExpire: (expireDays: number, currentDate: string) => object;
    isExpired: (currentDate: string) => boolean;
    clearExpired: (currentDate: string) => void;
}

class LocalData implements LocalDataInterface {
    private storageType: string;
    private dataName: string;
    private cachedData: HolderObject;
    
    constructor(dataName: string, storageType: string = 'localStorage') {
        this.storageType = storageType;
        this.dataName = dataName;
        this.cachedData = this.dataParse();
    }
    
    private dataParse(): object {
        return JSON.parse(GLOBAL_WINDOW[this.storageType].getItem(this.dataName) || '{}');
    }
    
    get(key: string): any {
        const data = key ? _get(this.cachedData, key) : this.cachedData;
        
        if (data && !_isEmpty(data)) {
            debugLog(`LocalData.get:%cData found in "${this.dataName}"`, 'color:green', data);
        } else {
            debugLog(`LocalData.get:%cStorage key in "${this.dataName}" not found because key isn\'t a string or does not exist.`, 'color:red');
        }
        
        return data;
    }
    
    add(data = {}): object {
        this.cachedData = _merge({}, this.cachedData, data);
        
        GLOBAL_WINDOW[this.storageType].setItem(this.dataName, JSON.stringify(this.cachedData));
        
        debugLog(`LocalData.add:%cData added to "${this.dataName}"`, 'color:green', this.cachedData);
        
        // Returning "dataParse" so the cached data can't be mutated accidentally.
        // The JSON.parse it does automatically "clones" the object.
        return this.dataParse();
    }
    
    update(data: object): object {
        return this.add(data);
    }
    
    put(data = {}, key?: string): object {
        if (key && this.cachedData[key]) {
            this.cachedData[key] = data;
        } else if (_isPlainObject(data)) {
            this.cachedData = data;
        }
        
        GLOBAL_WINDOW[this.storageType].setItem(this.dataName, JSON.stringify(this.cachedData));
        debugLog(`LocalData.put:%cData overwritten in "${this.dataName}"`, 'color:green', this.cachedData);
        
        // Returning "dataParse" so the cached data can't be mutated accidentally.
        // The JSON.parse it does automatically "clones" the object.
        return this.dataParse();
    }
    
    remove(key: string): object {
        this.cachedData = _omit(this.cachedData, key);
        
        this.put(this.cachedData);
        
        debugLog(`LocalData.remove:%cData (${key}) removed in "${this.dataName}"`, 'color:green', this.cachedData);
        
        // Returning "dataParse" so the cached data can't be mutated accidentally.
        // The JSON.parse it does automatically "clones" the object.
        return this.dataParse();
    }
    
    destroy(): void {
        this.cachedData = {};
        
        GLOBAL_WINDOW[this.storageType].removeItem(this.dataName);
        
        debugLog(`LocalData.destroy:%c"${this.dataName}" in ${this.storageType} deleted`, 'color:green');
    }
    
    private normalizeDate(date: number|string): number {
        if (typeof (date) === 'number') {
            if (date.toString().length < 13) {
                return date * 1000;
            }
            
            return date;
        } else if (typeof (date) === 'string') {
            return Date.parse(date);
        } else {
            throw new Error('LocalData: Must pass valid timestamp or Date.');
        }
    }
    
    private parseDate(date: number, pretty?: boolean) {
        return pretty ? new Date(date).toString() : Date.parse(date.toString());
    }
    
    private createExpire(days: number = 0, currentDate: number): { '_expires': string|number } {
        const dateFrom: Date = new Date(currentDate);
        const endDate = this.parseDate(new Date().setDate(dateFrom.getDate() + days), true);
        
        return { '_expires': endDate };
    }
    
    setExpire(expireDays: number = 0, currentDate = Date.now().toString()): object {
        if (!isNaN(expireDays)) {
            const expireData = this.add(this.createExpire(expireDays, this.normalizeDate(currentDate)));
            if (expireData) {
                debugLog(`LocalData.setExpire:%cExpired date set on "${this.dataName}"`, 'color:green', expireData);
            }
            
            return expireData;
        }
        
        debugLog(`LocalData.setExpire:%cExpired date NOT set on "${this.dataName}" because number of days is invalid.`, 'color:red', this.cachedData);
        
        return this.cachedData;
    }
    
    isExpired(currentDate = Date.now().toString()): boolean {
        const expData = _get(this.dataParse(), '_expires');
        const expDate = expData ? this.parseDate(expData) : null;
        let expired = false;
        
        if (expDate && expDate <= this.normalizeDate(currentDate)) {
            expired = true;
            debugLog(`LocalData.isExpired:%cExpired data found in "${this.dataName}"`, 'color:green');
        }
        
        return expired;
    }
    
    clearExpired(currentDate = Date.now().toString()): void {
        if (this.isExpired(currentDate)) {
            this.put({});
            
            debugLog(`LocalData.clearExpired:%cExpired data cleared in "${this.dataName}"`, 'color:green');
        }
    }
}

export default LocalData;
