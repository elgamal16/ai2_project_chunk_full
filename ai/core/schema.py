CAT = ["gender", "Partner", "Dependents", "PhoneService", "MultipleLines", "InternetService", "OnlineSecurity",
       "OnlineBackup", "DeviceProtection", "TechSupport", "StreamingTV", "StreamingMovies", "Contract",
       "PaperlessBilling", "PaymentMethod"]
NUM = ["SeniorCitizen", "tenure", "MonthlyCharges"]
FEATURES = CAT + NUM
ID_COL, PHONE_COL, EMAIL_COL = "customerID", "PhoneNumber", "Email"
ALLOWED = {
    "gender": {"Female", "Male"}, "Partner": {"Yes", "No"}, "Dependents": {"Yes", "No"}, "PhoneService": {"Yes", "No"},
    "MultipleLines": {"Yes", "No", "No phone service"}, "InternetService": {"DSL", "Fiber optic", "No"},
    "OnlineSecurity": {"Yes", "No", "No internet service"}, "OnlineBackup": {"Yes", "No", "No internet service"},
    "DeviceProtection": {"Yes", "No", "No internet service"}, "TechSupport": {"Yes", "No", "No internet service"},
    "StreamingTV": {"Yes", "No", "No internet service"}, "StreamingMovies": {"Yes", "No", "No internet service"},
    "Contract": {"Month-to-month", "One year", "Two year"}, "PaperlessBilling": {"Yes", "No"},
    "PaymentMethod": {"Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"},
}
RANGES = {"SeniorCitizen": (0, 1), "tenure": (0, 120), "MonthlyCharges": (0, 500)}
