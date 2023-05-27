from fastapi import FastAPI

from pygrowup import Calculator, helpers
from pygrowup.exceptions import *

app = FastAPI()
calculator = Calculator(adjust_height_data=False, adjust_weight_scores=False,
                        include_cdc=False, logger_name='pygrowup',
                        log_level='INFO')


@app.get("/calculate_zscore")
def calculate_zscore(gender: str, age: int, weight: float, height: float = None):
    if gender not in ['male', 'female']:
        return {
            "success": False,
            "message": "gender can only be one of male or female"
        }

    lhfa_zscore_for_my_child = None
    wfl_zscore_for_my_child = None
    valid_gender = helpers.get_good_sex(gender)
    result = None

    try:
        # calculate weight-for-age zscore
        wfa_zscore_for_my_child = calculator.wfa(weight, age, valid_gender)

        if height:
            # calculate length/height-for-age zscore
            lhfa_zscore_for_my_child = calculator.lhfa(height, age, valid_gender)
            # calculate weight-for-length zscore
            wfl_zscore_for_my_child = calculator.wfl(weight, age, valid_gender, height)

            if wfl_zscore_for_my_child < -3:
                result = "कृपया तुरंत आंगनवाड़ी केंद्र पर जाएं। आपका बच्चा अतिकुपोषित है"
            elif wfl_zscore_for_my_child < -2:
                result = "कृपया तुरंत आंगनवाड़ी केंद्र पर जाएं। आपका बच्चा कुपोषित है"
            else:
                result = "आपका बच्चा सामान्य है"

    except DataNotFound:
        return {
            "success": False,
            "message": "WHO/CDC data is not found for the requested observation"
        }
    except DataError:
        return {
            "success": False,
            "message": "error loading WHO/CDC data"
        }
    except InvalidAge:
        return {
            "success": False,
            "message": "age is invalid for requested indicator"
        }
    except InvalidMeasurement:
        return {
            "success": False,
            "message": "measurement is invalid for requested indicator"
        }

    return {
        "length_height_for_age_zscore": lhfa_zscore_for_my_child,
        "weight_for_age_zscore": wfa_zscore_for_my_child,
        "weight_for_length_zscore": wfl_zscore_for_my_child,
        "result": result,
        "success": True
    }
