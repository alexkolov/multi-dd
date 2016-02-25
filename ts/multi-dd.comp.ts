import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Pipe, PipeTransform} from 'angular2/core';
import {NgIf} from 'angular2/common';

@Pipe({
    name: "searchText"
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

        items = items.filter((item) => this.contains(item, key, search));

        return items;
    }
}

@Component({
    selector: 'multi-dd',
    pipes: [SearchTextPipe],
    templateUrl: './temps/multi-dd.html',
    derectives: [NgIf]
})

export class MultiDd {
    toggleSelectState: string = 'none';
    multiselectHeader: string = 'Auswahl';

    @Input('coll') coll: any;
    @Input('multi') multi: boolean;
    @Input('filter') filter: boolean;
    @Input('label') label: string;
    @Input('header') header: string;
    @Input('mutiselectModel') mutiselectModel: any;

    @Output() modelUpdated = new EventEmitter<any>();
    
    toggleSelect() {
        if (this.toggleSelectState === 'none') {

            this.toggleSelectState = 'block';

        } else {

            this.toggleSelectState = 'none';

        }
    }

    checkAll() {

        if (this.multi !== true) {
            return;
        }
        
        this.coll.forEach((t: any) => t.checked = true);

        this.updateModel();
    }

    unCheckAll() {
        this.coll.forEach((t: any) => t.checked = false);
        this.updateModel();
    }

    selectItem(item: any) {
        if (this.multiple !== true) {
            this.unCheckAll();
        }

        item.checked = !item.checked;

        this.updateModel();
    }

    updateModel() {
        this.mutiselectModel = [];
        for (let value of this.collection) {
            if (value.checked) {
                this.mutiselectModel.push(value);
            }
        }
        this.updateHeader();
        this.modelUpdated.emit(this.mutiselectModel);
    }

    updateHeader() {
        if (this.mutiselectModel.length > 0) {

            let header = this.header + ' ('
                + this.mutiselectModel.length + ')';

            this.multiselectHeader = header;

        } else {
            this.multiselectHeader = 'Auswahl';
        }
    }
}
