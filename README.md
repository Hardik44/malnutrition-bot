# Malnutrition bot

Setup:
```commandline
// Install virtualenv if not installed
pip install virtualenv

// Creates virtualenv named as growup
python -m venv growup

// activate virtualenv
source growup/bin/activate

// install requirements for project
pip install -r requirements.txt
```

Start Server:
```commandline
uvicorn main:app --reload
```

API request:
```
curl --location 'localhost:8000/calculate_zscore?gender=male&age=5&weight=10&height=100'
```

API doc:
```commandline
http://127.0.0.1:8000/docs#/default/calculate_zscore_calculate_zscore_get
```

Host fastAPI endpoint on deta.space:
https://deta.space/

- Create Gupshup bot and add `default.js` and `default.scr` files to build bot
- Update endpoint url into `botdata.json`
- Test bot on sandbox
