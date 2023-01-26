function isEmpty(str) {
    return (!str || 0 === str.length);
}

function urlFieldUpdate (workItemServices) {
    workItemServices.WorkItemFormService.getService().then(function (service) {
        var url = VSS.getConfiguration().witInputs.Url;
        var titleUrlText = VSS.getConfiguration().witInputs.Title;

        var fieldName = VSS.getConfiguration().witInputs.Field;
        var fieldName2 = VSS.getConfiguration().witInputs.Field2;
        var fieldName3 = VSS.getConfiguration().witInputs.Field3;
        
        var hideUrlIfEmptyField = (VSS.getConfiguration().witInputs.HideUrlIfEmptyField.toLowerCase() === 'true');

        service.getFieldValues([fieldName, fieldName2, fieldName3]).then(function (value) {
            var fieldValue = value[fieldName];
            var fieldValue2 = value[fieldName2];
            var fieldValue3 = value[fieldName3];

            url = url.replace('{field}', fieldValue);
            if (isEmpty(titleUrlText)) {
                titleUrlText = url;
            }
            url = url.replace('{field2}', fieldValue2);
            url = url.replace('{field3}', fieldValue3);

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
