import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, StatusBar, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { useFonts } from "expo-font";

const workingHoursData = {
  "2024-12-01": { hours: 8, rate: 200 },
  "2024-12-02": { hours: 6, rate: 200 },
  "2024-12-03": { hours: 0, rate: 200 },
  "2024-12-04": { hours: 7, rate: 200 },
  // Add more date entries...
};

const History = () => {
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [dateDetails, setDateDetails] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [totalPayroll, setTotalPayroll] = useState(0);

  useEffect(() => {
    processPayrollData();
  }, []);

  const processPayrollData = () => {
    const markedDatesTemp = {};
    let payroll = 0;

    for (const date in workingHoursData) {
      const { hours, rate } = workingHoursData[date];
      payroll += hours * rate;

      markedDatesTemp[date] = {
        marked: true,
        dotColor: hours > 0 ? "#82F5CB" : "#d9e1e8",
      };
    }

    setMarkedDates(markedDatesTemp);
    setTotalPayroll(payroll);
  };

  const handleDayPress = (day) => {
    const selectedDay = day.dateString;
    setSelectedDate(selectedDay);

    const details = workingHoursData[selectedDay];
    if (details) {
      setDateDetails({
        name: `Worked ${details.hours} hours`,
        details: `Hourly Rate: $${details.rate}`,
        total: `Total: $${details.hours * details.rate}`,
      });
    } else {
      setDateDetails(null);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Attendance History</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: "#1C1C1C",
          },
        }}
        theme={{
          selectedDayBackgroundColor: "#49cbeb",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#49cbeb",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          backgroundColor: "#f4f5f6",
          calendarBackground: "transparent",
          textDayFontFamily: "ZonaExtraLight",
          textDayHeaderFontFamily: "ZonaProBold",
          textMonthFontFamily: "ZonaProBold",
        }}
        style={styles.calendar}
      />
      <View style={styles.detailsContainer}>
        {dateDetails ? (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>
              Total Working Hours : {dateDetails.name.split(" ")[1]}
            </Text>
            <Text style={styles.itemDetails}>Punctuality : 8/10</Text>
            <Text style={styles.itemTotal}>Extra Work Hours : 2</Text>
            <Text style={styles.leaveText}>No of Leaves : 1 Day</Text>
          </View>
        ) : (
          <Text style={styles.noDataText}>Select a date to see details</Text>
        )}
      </View>
      <View style={styles.payrollContainer}>
        <Text style={styles.payrollText}>
          Monthly Payroll : ₹ {totalPayroll.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default History;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f6",
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: "ZonaProBold",
    color: "#1C1C1C",
    marginBottom: 10,
  },
  calendar: {
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "transparent",
    // elevation: 150,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 100,
  },
  item: {
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: "100%",
    paddingHorizontal: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: "ZonaExtraLight",
    color: "#1C1C1C",
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 16,
    fontFamily: "ZonaExtraLight",
    color: "#1C1C1C",
    marginBottom: 5,
  },
  itemTotal: {
    fontSize: 16,
    fontFamily: "ZonaExtraLight",
    color: "#1C1C1C",
    marginBottom: 5,
  },
  leaveText: {
    fontSize: 14,
    fontFamily: "ZonaExtraLight",
    color: "#ffe",
    marginTop: 10,
  },
  noDataText: {
    fontSize: 16,
    fontFamily: "ZonaExtraLight",
    color: "#999",
  },
  payrollContainer: {
    borderRadius: 10,
    elevation: 100,
    marginBottom: 30,
  },
  payrollText: {
    fontSize: 18,
    fontFamily: "ZonaProBold",
    color: "#1C1C1C",
    paddingHorizontal: 10,
  },
});
