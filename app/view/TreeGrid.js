/*
 * File: app/view/TreeGrid.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.view.TreeGrid', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treegrid',

    requires: [
        'MyApp.view.override.TreeGrid',
        'Four59Cool.ux.InlineAnything'
    ],

    height: 250,
    width: 400,
    title: 'My Tree Grid Panel',
    store: 'MyJsonTreeStore',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            viewConfig: {
                rootVisible: false
            },
            columns: [
                {
                    xtype: 'treecolumn',
                    width: 100,
                    dataIndex: 'region',
                    text: 'Region'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'name',
                    flex: 1,
                    text: 'Name'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'email',
                    flex: 1,
                    text: 'Email'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'city',
                    flex: 1,
                    text: 'City'
                },
                {
                    xtype: 'gridcolumn',
                    width: 75,
                    dataIndex: 'state',
                    text: 'State'
                },
                {
                    xtype: 'gridcolumn',
                    width: 100,
                    dataIndex: 'phone',
                    text: 'Phone'
                }
            ]
        });

        me.callParent(arguments);
    }

});