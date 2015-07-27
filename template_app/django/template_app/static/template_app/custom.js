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
            "search": "| inputlookup musicdata.csv | search bc_uri=/sync/addtolibrary* | stats count by artist_name | sort count desc | table artist_name count | head 5",
            "latest_time": "",
            "cancelOnUnload": true,
            "status_buckets": 0,
            "earliest_time": "",
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

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
        
        var element1 = new ChartElement({
            "id": "element1",
            "charting.legend.labelStyle.overflowMode": "ellipsisMiddle",
            "charting.axisY2.scale": "inherit",
            "charting.chart.stackMode": "default",
            "charting.axisLabelsX.majorLabelStyle.rotation": "0",
            "charting.axisTitleY2.visibility": "visible",
            "charting.chart.nullValueMode": "gaps",
            "charting.layout.splitSeries": "0",
            "charting.chart": "pie",
            "charting.chart.bubbleMinimumSize": "10",
            "charting.chart.bubbleMaximumSize": "50",
            "charting.axisLabelsX.majorLabelStyle.overflowMode": "ellipsisNone",
            "resizable": false,
            "charting.axisY.scale": "linear",
            "charting.legend.placement": "right",
            "charting.drilldown": "all",
            "charting.chart.sliceCollapsingThreshold": "0.01",
            "charting.chart.style": "shiny",
            "charting.axisX.scale": "linear",
            "charting.axisTitleY.visibility": "visible",
            "charting.axisTitleX.visibility": "visible",
            "charting.chart.bubbleSizeBy": "area",
            "charting.axisY2.enabled": "false",
            "managerid": "search1",
            "el": $('#element1')
        }, {tokens: true, tokenNamespace: "submitted"}).render();

        var element2 = new TableElement({
            "id": "element2",
            "drilldown": "row",
            "rowNumbers": "undefined",
            "wrap": "undefined",
            "managerid": "search2",
            "el": $('#element2')
        }, {tokens: true, tokenNamespace: "submitted"}).render();

        var element3 = new ChartElement({
            "id": "element3",
            "charting.legend.labelStyle.overflowMode": "ellipsisMiddle",
            "charting.axisY2.scale": "inherit",
            "charting.chart.stackMode": "default",
            "charting.axisLabelsX.majorLabelStyle.rotation": "0",
            "charting.axisTitleY2.visibility": "visible",
            "charting.chart.nullValueMode": "gaps",
            "charting.layout.splitSeries": "0",
            "charting.chart": "column",
            "charting.chart.bubbleMinimumSize": "10",
            "charting.chart.bubbleMaximumSize": "50",
            "charting.axisTitleY.visibility": "visible",
            "resizable": false,
            "charting.axisY.scale": "linear",
            "charting.legend.placement": "right",
            "charting.drilldown": "all",
            "charting.chart.sliceCollapsingThreshold": "0.01",
            "charting.chart.style": "shiny",
            "charting.axisX.scale": "linear",
            "charting.axisLabelsX.majorLabelStyle.overflowMode": "ellipsisNone",
            "charting.axisTitleX.visibility": "visible",
            "charting.chart.bubbleSizeBy": "area",
            "charting.axisY2.enabled": "undefined",
            "charting.axisTitleX.text": "Device",
            "charting.axisTitleY.text": "Downloads",
            "charting.legend.placement": "top",
            "charting.axisLabelsY.majorUnit": "100",
            "managerid": "search3",
            "el": $('#element3')
        }, {tokens: true, tokenNamespace: "submitted"}).render();

        var element4 = new TableElement({
            "id": "element4",
            "drilldown": "row",
            "rowNumbers": "undefined",
            "wrap": "undefined",
            "managerid": "search4",
            "el": $('#element4')
        }, {tokens: true, tokenNamespace: "submitted"}).render();
    
        //
        // VIEWS: FORM INPUTS
        //

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