import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import moment from "moment";
import { switchMap } from "rxjs/operators";
import { GetField } from "rxq/Doc";
import { SelectValues } from "rxq/Field";
import { useSession } from "dash-component-library/context";
import useSelectedFieldsHandle from "dash-component-library/hooks/useSelectedFields";

const QueryFiltersComponent = ({
  history,
  listedFields,
  maxFieldValues,
  dateFormat = {}
}) => {
  const {
    rxq: { doc$ }
  } = useSession()[0];

  const selectedFields = useSelectedFieldsHandle(maxFieldValues);

  const QLIK_BEGIN_DATE = "12/30/1899";
  const QLIK_DATE_FORMAT = "MM/DD/YYYY";

  const isValidDate = (dateString, format) => {
    return moment(dateString, format, true).isValid();
  };

  const getDaysBetweenDates = (
    startDate,
    startDateFormat,
    endDate,
    endDateformat
  ) => {
    var start = moment(startDate, startDateFormat);
    var end = moment(endDate, endDateformat);
    return end.diff(start, "days");
  };

  const getListedFilters = allFilters => {
    if (!allFilters) return {};
    if (!Array.isArray(listedFields) || listedFields.length === 0)
      return allFilters;

    const filters = {};
    for (let i = 0; i < listedFields.length; i++) {
      const fieldName = listedFields[i];
      if (Object.prototype.hasOwnProperty.call(allFilters, fieldName))
        filters[fieldName] = allFilters[fieldName];
    }
    return filters;
  };

  // Initial query paramters load
  useEffect(() => {
    if (history.location.search) {
      const queryParams = queryString.parse(history.location.search, {
        arrayFormat: "comma"
      });
      if (queryParams.filtersParam) {
        const filters = getListedFilters(JSON.parse(queryParams.filtersParam));
        Object.keys(filters).forEach(fieldName => {
          let fieldValues;
          let isDateField = false;
          if (dateFormat && dateFormat[fieldName]) {
            isDateField = filters[fieldName].every(value =>
              isValidDate(value, dateFormat[fieldName])
            );
          }

          if (isDateField) {
            fieldValues = filters[fieldName].map(value => ({
              qNumber: getDaysBetweenDates(
                QLIK_BEGIN_DATE,
                QLIK_DATE_FORMAT,
                value,
                dateFormat[fieldName]
              ),
              qIsNumeric: true
            }));
          } else {
            const isNumeric = !filters[fieldName].find(
              value => typeof value === "string"
            );
            fieldValues = filters[fieldName].map(value => ({
              [isNumeric ? "qNumber" : "qText"]: value,
              qIsNumeric: isNumeric
            }));
          }
          setTimeout(() => {
            doc$
              .pipe(
                switchMap(handle => handle.ask(GetField, fieldName)),
                switchMap(handle =>
                  handle.ask(SelectValues, fieldValues, false)
                )
              )
              .subscribe();
          }, [5000]);
        });
      }
    }
  }, []);

  useEffect(() => {
    const queryParams = document.location.search
      ? queryString.parse(document.location.search, { arrayFormat: "comma" })
      : {};

    const filters = getListedFilters(selectedFields);
    queryParams.filtersParam =
      Object.keys(filters).length > 0 ? JSON.stringify(filters) : undefined;

    const newQueryParams = queryString.stringify(queryParams, {
      arrayFormat: "comma"
    });
    history.push({ search: newQueryParams });
  }, [selectedFields]);

  return null;
};

QueryFiltersComponent.propTypes = {
  /** List that contains the field names that should be listened and displayed in the url.
   * If the list is empty, all selected fields will be used.
   * The default value is an empty array. */
  listedFields: PropTypes.array,
  /** Maximum number of values obtained from the current selections.
   * If the number of selected values is higher than the specified in the props, the field is not used.
   * The default value is 6. */
  maxFieldValues: PropTypes.number,
  /** Update this field to match the date format in the data. For example, "MM/DD/YYYY" is used for "03/01/2020" */
  dateFormat: PropTypes.object
};

QueryFiltersComponent.defaultProps = {
  dateFormat: {},
  listedFields: [],
  maxFieldValues: 6
};

export default withRouter(QueryFiltersComponent);
