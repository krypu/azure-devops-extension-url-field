function isEmpty(str) {
    return (!str || 0 === str.length);
}

function urlFieldUpdate (workItemServices) {
    workItemServices.WorkItemFormService.getService().then(function (service) {
        var url = VSS.getConfiguration().witInputs.Url;
        var title = VSS.getConfiguration().witInputs.Title;
        var field = VSS.getConfiguration().witInputs.Field;
        var generate = (VSS.getConfiguration().witInputs.Generate.toLowerCase() === 'false');
        
        service.getFieldValues([VSS.getConfiguration().witInputs.Field]).then(function (value) {
            var fieldKey = value[field];
            url = url.replace('{field}', fieldKey);
            if (isEmpty(title)) {
                title = url;
            }
            var urlField = document.getElementById('urlField');
            if (!generate || !isEmpty(fieldKey)) {
                urlField.innerText = title;
                urlField.href = urlField.title = url;
            } else {
                urlField.innerText = "";
                urlField.href = urlField.title = "";
            }
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
