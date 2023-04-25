import { FormlyFieldConfig } from "@ngx-formly/core";

export const formlyVozidloLevy = () => {
    return [ 
        {
          key: 'cislo',
          type: 'number-mask',
          templateOptions: {
            label: 'Number',
            tooltip: 'Enter a number',
            maskOptions: { separateThousands: true },
            required: true,
            min: 500,
            max: 3500,
            grid: { label: 'col-sm-4', input: 'col-sm-8' }
          }
        },                         
        {
          key: 'number',
          type: 'number-mask',
          templateOptions: {
            label: 'Number',
            tooltip: 'Enter a number',
            maskOptions: { separateThousands: true },
            required: true,
            grid: { label: 'col-sm-4', input: 'col-sm-8' }
          }
        },
        {
          key: 'partner.psc',
          type: 'typeahead',
          templateOptions: {
            label: 'Typeahead',
            typeahead: ['Brno', 'Praha', 'Litomyšl'],
            required: true,
            grid: { label: 'col-sm-4', input: 'col-sm-8' }
          }
        },              
        {
          key: 'partner.zip',
          type: 'number-mask',
          templateOptions: {
            label: 'ADRESA.PSC.LABEL',
            tooltip: 'ADRESA.PSC.HINT',
            placeholder: 'ADRESA.PSC.PLACEHOLDER',
            typeahead: [15000, 57001],
            maskOptions: { formatZip: true },
            required: true,
            grid: { label: 'col-sm-4', input: 'col-sm-8' }
          }
        },
        {
          key: 'partner.rc',
          type: 'rc-mask',
          templateOptions: {
            label: 'RČ',
            maskOptions: { emitInvalid: true, emitAll: false },
            required: true,
            grid: { label: 'col-sm-4', input: 'col-sm-8' }
          }
        },
        {
          key: 'partner.tel',
          type: 'tel-mask',
          templateOptions: {
            label: 'Telefon',
            required: true,
            grid: { label: 'col-sm-4', input: 'col-sm-8' }
          }
        },
        {
          key: 'startdate',
          type: 'datepicker',
          templateOptions: {
            label: 'Date',
            required: true,
            minDate: new Date(),
            bsConfig: {
              dateInputFormat: 'D.M.YYYY',
              showWeekNumbers: false,
              containerClass: 'theme-dark-blue',
            },                  
          }
        },                                                          
      ];
  };