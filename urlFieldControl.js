function isEmpty(str) {
    return (!str || 0 === str.length);
}

function urlFieldUpdate (workItemServices) {
    workItemServices.WorkItemFormService.getService().then(function (service) {
        var url = VSS.getConfiguration().witInputs.Url;
        var titleUrlText = VSS.getConfiguration().witInputs.Title;
        var fieldName = VSS.getConfiguration().witInputs.Field;
        var hideUrlIfEmptyField = (VSS.getConfiguration().witInputs.HideUrlIfEmptyField.toLowerCase() === 'true');
        
        service.getFieldValues([VSS.getConfiguration().witInputs.Field]).then(function (value) {
            var fieldValue = value[fieldName];
            url = url.replace('{field}', fieldValue);
            if (isEmpty(titleUrlText)) {
                titleUrlText = url;
            }
            var urlField = document.getElementById('urlField');
            if (hideUrlIfEmptyField && isEmpty(fieldValue)) {
                urlField.innerText = "";
                urlField.href = urlField.title = "";
            } else {
                urlField.innerText = titleUrlText;
                urlField.href = urlField.title = url;
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
