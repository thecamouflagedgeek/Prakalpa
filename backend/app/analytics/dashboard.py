def get_dashboard_stats(df):

    total_firs = len(df)

    districts = df["district"].nunique()

    stations = df["police_station"].nunique()

    high_risk = (
        df[df["risk_level"] == "High"]
        ["police_station"]
        .nunique()
    )

    top_crimes = (
        df["crime_head"]
        .value_counts()
        .head(5)
        .reset_index()
    )

    top_crimes.columns = ["crime", "count"]

    return {

        "total_firs": total_firs,

        "districts": districts,

        "stations": stations,

        "high_risk_zones": high_risk,

        "top_crimes": top_crimes.to_dict(
            orient="records"
        )

    }