function isEmpty(str) {
    return (!str || 0 === str.length);
}

function urlFieldUpdate (workItemServices) {
    workItemServices.WorkItemFormService.getService().then(function (service) {
        var url = VSS.getConfiguration().witInputs.Url;
        var title = VSS.getConfiguration().witInputs.Title;
        var field = VSS.getConfiguration().witInputs.Field;
        
        service.getFieldValues([VSS.getConfiguration().witInputs.Field]).then(function (value) {
            var fieldKey = value[field];
            url = url.replace('{field}', fieldKey);
            if (isEmpty(title)) {
                title = url;
            }
            var urlField = document.getElementById('urlField');
            urlField.innerText = title;
            urlField.href = urlField.title = url;
        });
    });
};

VSS.require(["TFS/WorkItemTracking/Services"], function(workItemServices) {
    VSS.register(VSS.getContribution().id, () => {
        return {
            onLoaded: () => {
                urlFieldUpdate(workItemServices);
            },
            onSaved: () => {
                urlFieldUpdate(workItemServices);
            },
            onRefreshed: () => {
                urlFieldUpdate(workItemServices);
            }
        }
    });
    VSS.notifyLoadSucceeded();
});