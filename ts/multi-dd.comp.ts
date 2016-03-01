import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Pipe, PipeTransform} from 'angular2/core';
import {NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

@Pipe({
    name: "searchPipe"
})

class SearchTextPipe implements PipeTransform{

    contains(item, key, search) {
        search = search.toLowerCase();
        return item[key].toLowerCase().indexOf(search) !== -1;
    }

    transform(items: any, args: string[]) {

        let [search, key] = args;

        if (search === '' || search === undefined) {
            return items;
        }

        items = items.filter(item => this.contains(item, key, search));

        return items;
    }
}

@Component({
    selector: 'multi-dd',
    pipes: [SearchTextPipe],
    templateUrl: './temps/multi-dd.html',
    styleUrls: ['./css/multi-dd.css'],
    derectives: [NgIf, NgSwitch, NgSwitchWhen]
})

export class MultiDd {
    isOpen: string = 'none';
    hLength: number = 0;
    @Input('header') hCapture: string;
    @Input('multi') multi: boolean;
    @Input('filter') filter: boolean;
    @Input('controls') controls: boolean;
    @Input('coll') coll: any;
    @Input('key') key: any;
    @Input('label') label: string;
    @Input('selected') selected: any;
    @Output() selectedChange = new EventEmitter();

    headerUpdate() {
        this.hLength = this.selected.length;
        this.selectedChange.next(this.selected);
    }

    isOpenToggle() {
        this.isOpen === 'none'
            ? this.isOpen = 'block'
            : this.isOpen = 'none';
    }

    checkAll() {
        if (this.multi === true) {
            this.selected = [];

            for (let item of this.coll) {
                this.selected.push(item);
            }

            this.headerUpdate();
        }
    }

    unCheckAll() {
        this.selected = [];
        this.headerUpdate();
    }

    isSelected(item, key): boolean {
        if (item && key && item[key]) {
            let s = this.selected;

            s = s.filter(el => {
                return (el[key] && el[key] === item[key])
                    ? true
                    : false;
            });

            return s.length > 0 ? true : false;

        }
        else {
            return false;
        }
    }

    itemToggle(item) {
        let isSelected = this.isSelected(item, this.key);

        if (this.multi !== true) {
            this.unCheckAll();
            if(!isSelected) {
                this.selected.push(item);
            }
        }
        else {
            if(isSelected) {
                let s = this.selected;
                s = s.filter(el => el[this.key] !== item[this.key]);
                this.selected = s;
            }
            else {
                // view does not update
                // this.selected.push(item);
                this.selected = this.selected.concat([item]);
            }
        }

        this.headerUpdate();
    }

    isIn(coll, el, key) {
        for (let item of coll) {
            if(item[key] === el[key]) {
                return true;
            }
        }
        return false;
    }

    modelUpdate() {
        let s = this.selected;
        if(s) {
            s = s.filter(item => this.isIn(this.coll, item, this.key));
            this.selected = s;
            this.headerUpdate();

        }
    }

    ngOnChanges(changes: {[coll: string]: SimpleChange}) {
        if(changes['coll']) {
            this.modelUpdate();
        }
    }

    ngOnInit() {
        this.hCapture = this.hCapture === undefined
            ? 'Auswahl'
            : this.hCapture;

        this.multi = this.multi === undefined
            ? false
            : this.multi;

        this.filter = this.filter === undefined
            ? false
            : this.filter;

        this.controls = this.controls === undefined
            ? false
            : this.controls;

        this.coll = this.coll === undefined
            ? []
            : this.coll;

        this.key = this.key === undefined
            ? 'id'
            : this.key;

        this.label = this.label === undefined
            ? 'label'
            : this.label;

        this.selected = this.selected === undefined
            ? []
            : this.selected;
    }
}
