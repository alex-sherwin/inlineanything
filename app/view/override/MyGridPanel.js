Ext.define('MyApp.view.override.MyGridPanel', {
    override: 'MyApp.view.MyGridPanel',
    
    plugins: [{
        ptype: 'inlineanything',

        inlineConfigs: {

            default: function (record, column) {

                return {

                    // needs alias or xclass
                    xtype: 'container',

                    height: 75,

                    layout: 'hbox',

                    items: [{

                        xtype: 'label',
                        text: 'name: ' + record.data.name
                    }]

                };
            }
        }
        
        
    }]
    
});