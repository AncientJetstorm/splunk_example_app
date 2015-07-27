var urlprefix = document.URL.substr(0, document.URL.search("/dj"));

require.config({
    baseUrl: urlprefix + "/static/js",
    waitSeconds: 0 // Disable require.js load timeout
});

//
// LIBRARY REQUIREMENTS
//
// In the require function, we include the necessary libraries and modules for
// the HTML dashboard. Then, we pass variable names for these libraries and
// modules as function parameters, in order.
// 
// When you add libraries or modules, remember to retain this mapping order
// between the library or module and its function parameter. You can do this by
// adding to the end of these lists, as shown in the commented examples below.

require([
    "splunkjs/mvc",
    "splunkjs/mvc/utils",
    "splunkjs/mvc/tokenutils",
    "underscore",
    "jquery",
    "splunkjs/mvc/simplexml",
    "splunkjs/mvc/headerview",
    "splunkjs/mvc/footerview",
    "splunkjs/mvc/simplexml/dashboardview",
    "splunkjs/mvc/simplexml/element/chart",
    "splunkjs/mvc/simplexml/element/event",
    "splunkjs/mvc/simplexml/element/html",
    "splunkjs/mvc/simplexml/element/list",
    "splunkjs/mvc/simplexml/element/map",
    "splunkjs/mvc/simplexml/element/single",
    "splunkjs/mvc/simplexml/element/table",
    "splunkjs/mvc/simpleform/formutils",
    "splunkjs/mvc/simpleform/input/dropdown",
    "splunkjs/mvc/simpleform/input/radiogroup",
    "splunkjs/mvc/simpleform/input/multiselect",
    "splunkjs/mvc/simpleform/input/checkboxgroup",
    "splunkjs/mvc/simpleform/input/text",
    "splunkjs/mvc/simpleform/input/timerange",
    "splunkjs/mvc/simpleform/input/submit",
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc/savedsearchmanager",
    "splunkjs/mvc/postprocessmanager",
    "splunkjs/mvc/simplexml/urltokenmodel"
    // Add comma-separated libraries and modules manually here, for example:
    // ..."splunkjs/mvc/simplexml/urltokenmodel",
    // "splunkjs/mvc/checkboxview"
    ],
    function(
        mvc,
        utils,
        TokenUtils,
        _,
        $,
        DashboardController,
        HeaderView,
        FooterView,
        Dashboard,
        ChartElement,
        EventElement,
        HtmlElement,
        ListElement,
        MapElement,
        SingleElement,
        TableElement,
        FormUtils,
        DropdownInput,
        RadioGroupInput,
        MultiSelectInput,
        CheckboxGroupInput,
        TextInput,
        TimeRangeInput,
        SubmitButton,
        SearchManager,
        SavedSearchManager,
        PostProcessManager,
        UrlTokenModel

        // Add comma-separated parameter names here, for example: 
        // ...UrlTokenModel, 
        // CheckboxView
        ) {


        var pageLoading = true;
        // 
        // TOKENS
        //
        
        // Create token namespaces
        var urlTokenModel = new UrlTokenModel();
        mvc.Components.registerInstance('url', urlTokenModel);
        var defaultTokenModel = mvc.Components.getInstance('default', {create: true});
        var submittedTokenModel = mvc.Components.getInstance('submitted', {create: true});

        urlTokenModel.on('url:navigate', function() {
            defaultTokenModel.set(urlTokenModel.toJSON());
            if (!_.isEmpty(urlTokenModel.toJSON()) && !_.all(urlTokenModel.toJSON(), _.isUndefined)) {
                submitTokens();
            } else {
                submittedTokenModel.clear();
            }
        });

        // Initialize tokens
        defaultTokenModel.set(urlTokenModel.toJSON());

        function submitTokens() {
            // Copy the contents of the defaultTokenModel to the submittedTokenModel and urlTokenModel
            FormUtils.submitForm({ replaceState: pageLoading });
        }

        function setToken(name, value) {
            defaultTokenModel.set(name, value);
            submittedTokenModel.set(name, value);
        }

        function unsetToken(name) {
            defaultTokenModel.unset(name);
            submittedTokenModel.unset(name);
        }
        //
        // SEARCH MANAGERS
        //

        var search1 = new SearchManager({
            "id": "search1",
            "search": "| inputlookup musicdata.csv | search bc_uri=/sync/addtolibrary* | stats count by artist_name | sort count desc | table artist_name count | head $field1$",
            "latest_time": "",
            "cancelOnUnload": true,
            "status_buckets": 0,
            "earliest_time": "",
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true});

        var search2 = new SearchManager({
            "id": "search2",
            "search": "| inputlookup musicdata.csv | search bc_uri=/sync/addtolibrary* | stats count by track_name | sort count desc | table track_name count ",
            "latest_time": "",
            "cancelOnUnload": true,
            "status_buckets": 0,
            "earliest_time": "",
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

        var search3 = new SearchManager({
            "id": "search3",
            "search": "| inputlookup musicdata.csv | search eventtype=* | stats count by eventtype",
            "latest_time": "",
            "cancelOnUnload": true,
            "status_buckets": 0,
            "earliest_time": "0",
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

        var search4 = new SearchManager({
            "id": "search4",
            "search": "| inputlookup musicdata.csv | search bc_uri=/sync/addtolibrary* | sort artist_name by eventtype | fields - _time | fields - bc_uri | fields - search_terms",
            "latest_time": "",
            "cancelOnUnload": true,
            "status_buckets": 0,
            "earliest_time": "",
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

        // extras delete

        var search8 = new SearchManager({
            "id": "search8",
            "search": "| inputlookup musicdata.csv | search bc_uri=/sync/addtolibrary* | stats count by artist_name | sort count desc | table artist_name count | head 5",
            "earliest_time": "",
            "cancelOnUnload": true,
            "latest_time": "",
            "status_buckets": 0,
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

        var search9 = new SearchManager({
            "id": "search9",
            "search": "| inputlookup musicdata.csv | search bc_uri=/sync/addtolibrary* | stats count by artist_name | sort count desc | table artist_name count | head 5",
            "earliest_time": "0",
            "cancelOnUnload": true,
            "latest_time": "",
            "status_buckets": 0,
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

        var search10 = new SearchManager({
            "id": "search10",
            "search": "| inputlookup musicdata.csv | search bc_uri=/sync/addtolibrary* | stats count by artist_name | sort count desc | table artist_name count | head 5",
            "earliest_time": "0",
            "cancelOnUnload": true,
            "latest_time": "",
            "status_buckets": 0,
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

        var search11 = new SearchManager({
            "id": "search11",
            "search": "| inputlookup musicdata.csv | search eventtype=* | stats count by eventtype",
            "earliest_time": "0",
            "cancelOnUnload": true,
            "latest_time": "",
            "status_buckets": 0,
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

        var search13 = new SearchManager({
            "id": "search13",
            "search": "| inputlookup musicdata.csv | search bc_uri=/sync/addtolibrary* | stats count by track_name | sort count desc | table track_name count | head 10",
            "earliest_time": "0",
            "cancelOnUnload": true,
            "latest_time": "",
            "status_buckets": 0,
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

        var search14 = new SearchManager({
            "id": "search14",
            "search": "| inputlookup musicdata.csv | search eventtype=* | stats count by eventtype",
            "earliest_time": "0",
            "cancelOnUnload": true,
            "latest_time": "",
            "status_buckets": 0,
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

        //
        // SPLUNK HEADER AND FOOTER
        //

        new HeaderView({
            id: 'header',
            section: 'dashboards',
            el: $('.header'),
            acceleratedAppNav: true,
            useSessionStorageCache: true
        }, {tokens: true}).render();

        new FooterView({
            id: 'footer',
            el: $('.footer')
        }, {tokens: true}).render();


        //
        // DASHBOARD EDITOR
        //

        //
        // VIEWS: VISUALIZATION ELEMENTS
        //

        // Generate random color on page load
        //var genColor = generateColor();
        var genColor = "#BB3B23";
        // Create different shades of color and put them into a string of an array
        var tempColors = "[" + ColorLuminance(genColor, Math.random()) + ", " + ColorLuminance(genColor, Math.random()) +", " + ColorLuminance(genColor, 0.0) + ", " + ColorLuminance(genColor, -Math.random()) + ", " + ColorLuminance(genColor, -Math.random()) + "]";
        // Replace the # with 0x
        var finalResult = tempColors.replace(/#/g, "0x");
        // Pie chart
        var element1 = new ChartElement({
            "id": "element1",
            "charting.chart": "pie",
            "charting.seriesColors": finalResult,
            "resizable": false,
            "managerid": "search1",
            "el": $('#element1')
        }, {tokens: true, tokenNamespace: "submitted"}).render();
        // Table of top tracks
        var element2 = new TableElement({
            "id": "element2",
            "drilldown": "row",
            "rowNumbers": "undefined",
            "wrap": "undefined",
            "managerid": "search2",
            "el": $('#element2')
        }, {tokens: true, tokenNamespace: "submitted"}).render();
        // Column chart
        var element3 = new ChartElement({
            "id": "element3",
            "charting.chart": "column",
            "resizable": false,
            "charting.seriesColors": "[0xBB3B23]",
            "charting.legend.placement": "right",
            "charting.drilldown": "all",
            "charting.axisTitleX.text": "Device",
            "charting.axisTitleY.text": "Downloads",
            "charting.legend.placement": "top",
            "managerid": "search3",
            "el": $('#element3')
        }, {tokens: true, tokenNamespace: "submitted"}).render();
        // Table of artists by name
        var element4 = new TableElement({
            "id": "element4",
            "drilldown": "row",
            "rowNumbers": "undefined",
            "wrap": "undefined",
            "managerid": "search4",
            "el": $('#element4')
        }, {tokens: true, tokenNamespace: "submitted"}).render();
        //extras delete

        
        var element8 = new ChartElement({
            "id": "element8",
            "charting.drilldown": "all",
            "charting.axisTitleY.visibility": "visible",
            "charting.chart.sliceCollapsingThreshold": "0.01",
            "charting.chart.bubbleSizeBy": "area",
            "charting.chart.nullValueMode": "gaps",
            "charting.legend.labelStyle.overflowMode": "ellipsisMiddle",
            "charting.chart.bubbleMaximumSize": "50",
            "charting.axisX.scale": "linear",
            "charting.axisY.scale": "linear",
            "charting.axisTitleY2.visibility": "visible",
            "charting.axisLabelsX.majorLabelStyle.overflowMode": "ellipsisNone",
            "charting.axisTitleX.visibility": "visible",
            "charting.axisY2.scale": "inherit",
            "resizable": true,
            "charting.axisY2.enabled": "false",
            "charting.chart.style": "shiny",
            "charting.chart.bubbleMinimumSize": "10",
            "charting.legend.placement": "right",
            "charting.layout.splitSeries": "0",
            "charting.chart.stackMode": "default",
            "charting.chart": "line",
            "charting.axisLabelsX.majorLabelStyle.rotation": "0",
            "managerid": "search8",
            "el": $('#element8')
        }, {tokens: true, tokenNamespace: "submitted"}).render();

        
        var element9 = new ChartElement({
            "id": "element9",
            "charting.drilldown": "all",
            "charting.axisTitleY.visibility": "visible",
            "charting.chart.sliceCollapsingThreshold": "0.01",
            "charting.chart.bubbleSizeBy": "area",
            "charting.chart.nullValueMode": "gaps",
            "charting.legend.labelStyle.overflowMode": "ellipsisMiddle",
            "charting.chart.bubbleMaximumSize": "50",
            "charting.axisX.scale": "linear",
            "charting.axisY.scale": "linear",
            "charting.axisTitleY2.visibility": "visible",
            "charting.axisLabelsX.majorLabelStyle.overflowMode": "ellipsisNone",
            "charting.axisTitleX.visibility": "visible",
            "charting.axisY2.scale": "inherit",
            "resizable": true,
            "charting.axisY2.enabled": "false",
            "charting.chart.style": "shiny",
            "charting.chart.bubbleMinimumSize": "10",
            "charting.legend.placement": "right",
            "charting.layout.splitSeries": "0",
            "charting.chart.stackMode": "default",
            "charting.chart": "area",
            "charting.axisLabelsX.majorLabelStyle.rotation": "0",
            "managerid": "search9",
            "el": $('#element9')
        }, {tokens: true, tokenNamespace: "submitted"}).render();

        
        var element10 = new ChartElement({
            "id": "element10",
            "charting.drilldown": "all",
            "charting.axisTitleY.visibility": "visible",
            "charting.chart.sliceCollapsingThreshold": "0.01",
            "charting.chart.bubbleSizeBy": "area",
            "charting.chart.nullValueMode": "gaps",
            "charting.legend.labelStyle.overflowMode": "ellipsisMiddle",
            "charting.chart.bubbleMaximumSize": "50",
            "charting.axisX.scale": "linear",
            "charting.axisY.scale": "linear",
            "charting.axisTitleY2.visibility": "visible",
            "charting.axisLabelsX.majorLabelStyle.overflowMode": "ellipsisNone",
            "charting.axisTitleX.visibility": "visible",
            "charting.axisY2.scale": "inherit",
            "resizable": true,
            "charting.axisY2.enabled": "false",
            "charting.chart.style": "shiny",
            "charting.chart.bubbleMinimumSize": "10",
            "charting.legend.placement": "right",
            "charting.layout.splitSeries": "0",
            "charting.chart.stackMode": "default",
            "charting.chart": "column",
            "charting.axisLabelsX.majorLabelStyle.rotation": "0",
            "managerid": "search10",
            "el": $('#element10')
        }, {tokens: true, tokenNamespace: "submitted"}).render();

        
        var element11 = new ChartElement({
            "id": "element11",
            "charting.drilldown": "all",
            "charting.axisTitleY.visibility": "visible",
            "charting.chart.sliceCollapsingThreshold": "0.01",
            "charting.chart.bubbleSizeBy": "area",
            "charting.chart.nullValueMode": "gaps",
            "charting.legend.labelStyle.overflowMode": "ellipsisMiddle",
            "charting.chart.bubbleMaximumSize": "50",
            "charting.axisX.scale": "linear",
            "charting.axisY.scale": "linear",
            "charting.axisTitleY2.visibility": "visible",
            "charting.axisLabelsX.majorLabelStyle.overflowMode": "ellipsisNone",
            "charting.axisTitleX.visibility": "visible",
            "charting.axisY2.scale": "inherit",
            "resizable": true,
            "charting.axisY2.enabled": "false",
            "charting.chart.style": "shiny",
            "charting.chart.bubbleMinimumSize": "10",
            "charting.legend.placement": "right",
            "charting.layout.splitSeries": "0",
            "charting.chart.stackMode": "default",
            "charting.chart": "bar",
            "charting.axisLabelsX.majorLabelStyle.rotation": "0",
            "managerid": "search11",
            "el": $('#element11')
        }, {tokens: true, tokenNamespace: "submitted"}).render();
        
        var element13 = new ChartElement({
            "id": "element13",
            "charting.drilldown": "all",
            "charting.axisTitleY.visibility": "visible",
            "charting.chart.sliceCollapsingThreshold": "0.01",
            "charting.chart.bubbleSizeBy": "area",
            "charting.chart.nullValueMode": "gaps",
            "charting.legend.labelStyle.overflowMode": "ellipsisMiddle",
            "charting.chart.bubbleMaximumSize": "50",
            "charting.axisX.scale": "linear",
            "charting.axisY.scale": "linear",
            "charting.axisTitleY2.visibility": "visible",
            "charting.axisLabelsX.majorLabelStyle.overflowMode": "ellipsisNone",
            "charting.axisTitleX.visibility": "visible",
            "charting.axisY2.scale": "inherit",
            "resizable": true,
            "charting.axisY2.enabled": "false",
            "charting.chart.style": "shiny",
            "charting.chart.bubbleMinimumSize": "10",
            "charting.legend.placement": "right",
            "charting.layout.splitSeries": "0",
            "charting.chart.stackMode": "default",
            "charting.chart": "scatter",
            "charting.axisLabelsX.majorLabelStyle.rotation": "0",
            "managerid": "search13",
            "el": $('#element13')
        }, {tokens: true, tokenNamespace: "submitted"}).render();

        
        var element14 = new ChartElement({
            "id": "element14",
            "charting.drilldown": "all",
            "charting.axisTitleY.visibility": "visible",
            "charting.chart.sliceCollapsingThreshold": "0.01",
            "charting.chart.bubbleSizeBy": "area",
            "charting.chart.nullValueMode": "gaps",
            "charting.legend.labelStyle.overflowMode": "ellipsisMiddle",
            "charting.chart.bubbleMaximumSize": "50",
            "charting.axisX.scale": "linear",
            "charting.axisY.scale": "linear",
            "charting.axisTitleY2.visibility": "visible",
            "charting.axisLabelsX.majorLabelStyle.overflowMode": "ellipsisNone",
            "charting.axisTitleX.visibility": "visible",
            "charting.axisY2.scale": "inherit",
            "resizable": true,
            "charting.axisY2.enabled": "false",
            "charting.chart.style": "shiny",
            "charting.chart.bubbleMinimumSize": "10",
            "charting.legend.placement": "right",
            "charting.layout.splitSeries": "0",
            "charting.chart.stackMode": "default",
            "charting.chart": "bubble",
            "charting.axisLabelsX.majorLabelStyle.rotation": "0",
            "managerid": "search14",
            "el": $('#element14')
        }, {tokens: true, tokenNamespace: "submitted"}).render();

    
        //
        // VIEWS: FORM INPUTS
        //

        var input1 = new DropdownInput({
            "id": "input1",
            "choices": [
                {"value": "1", "label": "1"},
                {"value": "2", "label": "2"},
                {"value": "3", "label": "3"},
                {"value": "4", "label": "4"},
                {"value": "5", "label": "5"},
                {"value": "6", "label": "6"},
                {"value": "7", "label": "7"},
                {"value": "8", "label": "8"},
                {"value": "9", "label": "9"},
                {"value": "10", "label": "10"},
                {"value": "11", "label": "11"},
                {"value": "12", "label": "12"},
                {"value": "13", "label": "13"},
                {"value": "14", "label": "14"},
                {"value": "15", "label": "15"},
                {"value": "16", "label": "16"},
                {"value": "17", "label": "17"},
                {"value": "18", "label": "18"},
                {"value": "19", "label": "19"},
                {"value": "20", "label": "20"}
            ],
            "default": "10",
            "searchWhenChanged": true,
            "selectFirstChoice": false,
            "showClearButton": false,
            "value": "$field1$",
            "el": $('#input1')
        }, {tokens: true}).render();

        input1.on("change", function(newValue) {
            FormUtils.handleValueChange(input1);
        });

        // This section is only included for forms
        // Initialize time tokens to default
        if (!defaultTokenModel.has('earliest') && !defaultTokenModel.has('latest')) {
            defaultTokenModel.set({ earliest: '0', latest: '' });
        }

        submitTokens();


        //
        // DASHBOARD READY
        //

        DashboardController.ready();
        pageLoading = false;

    }
);