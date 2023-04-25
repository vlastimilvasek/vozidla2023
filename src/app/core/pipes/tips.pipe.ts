import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Tips'
})
export class TipsPipe implements PipeTransform {

    transform(obj): string {
        let res = '';
        if (obj.typ === 'PLUS') {
            res = '<i class="fa-li text-success fas fa-check"></i>' + obj.text;
        } else if (obj.typ === 'INFO') {
            res = '<i class="fa-li text-info fas fa-info-circle"></i>' + obj.text;
        } else if (obj.typ === 'MINUS') {
            res = '<i class="fa-li text-danger fas fa-times"></i>' + obj.text;
        }
        return res;
    }

}
