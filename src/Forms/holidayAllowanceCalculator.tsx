import { useEffect, useState } from "react";

import {
  englandBkHol,
  scotlandBankHol,
  northIrBankHol,
  salaryBpMap,
} from "./variables";
export const AllowanceForm = (): JSX.Element => {
  const defDate = new Date(new Date().getFullYear(), 0, 1)
    .toISOString()
    .substring(0, 10);
  const [startDate, setStartDate] = useState<string>(defDate);
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [salary, setGrossSalary] = useState<number>(35000);
  const [salaryBasis, setSalaryBasis] = useState<string>("Annually");
  const [daysWorkedPerWeek, setDaysWorkedPerWeek] = useState<number>(5);
  const [startPeriodSpecified, setStartPeriodSpecified] =
    useState<boolean>(true);
  const [currentHolidayPeriodStartDate, setcurrentHolidayPeriodStartDate] =
    useState<string>(defDate);
  const [jurisdiction, setJurisdiction] = useState<string>("England & Wales");
  const [annualHolidaysAllowance, setAnnualyHolidaysAllowance] =
    useState<number>(28);
  const [incBankHolidays, setIncBankHolidays] = useState<boolean>(true);
  const [holidayCarryOver, setHolidayCarryOver] = useState<number>(0);
  const [holidayTaken, setHolidayTaken] = useState<number>(7);
  const [totHolidays, setTotHolidays] = useState<number>(0);

  const [accruedThisYear, setAccruedThisYear] = useState<number>(0);

  const [totAccrued, setTotAccrued] = useState<number | undefined>();
  const [totPayout, setTotPayout] = useState<number | string>(0);
  const [dailyPay, setDailyPay] = useState<number | string>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const [adjustment, setadjustment] = useState<number>(0);

  const submt = () => {
    differenceString(currentHolidayPeriodStartDate, endDate);
    if (
      startDate !== "" &&
      endDate !== "" &&
      currentHolidayPeriodStartDate !== "" &&
      salary !== undefined &&
      salaryBasis !== "" &&
      !isNaN(daysWorkedPerWeek) &&
      daysWorkedPerWeek !== undefined &&
      daysWorkedPerWeek !== null &&
      jurisdiction !== undefined &&
      !isNaN(annualHolidaysAllowance) &&
      incBankHolidays !== undefined &&
      !isNaN(holidayCarryOver) &&
      !isNaN(holidayTaken) &&
      daysWorkedPerWeek > 0 &&
      daysWorkedPerWeek <= 7 &&
      salary > 0 &&
      annualHolidaysAllowance !== -1
    ) {
      if (startPeriodSpecified && currentHolidayPeriodStartDate === "") return;
      const sdSplit = startDate.split("-").map((el) => parseInt(el));
      const sd = new Date(sdSplit[0], sdSplit[1] - 1, sdSplit[2]);
      const edSplit = endDate.split("-").map((el) => parseInt(el));

      const ed = new Date(edSplit[0], edSplit[1] - 1, edSplit[2]).getTime();

      const contractHolidayStartPeriodSplit = startPeriodSpecified
        ? currentHolidayPeriodStartDate!.split("-").map((el) => parseInt(el))
        : null;

      let contractHolidayStartPer = new Date(
        contractHolidayStartPeriodSplit && startPeriodSpecified
          ? Math.max(
              new Date(
                contractHolidayStartPeriodSplit[0],
                contractHolidayStartPeriodSplit[1] - 1,
                contractHolidayStartPeriodSplit[2]
              ).getTime(),
              sd.getTime()
            )
          : sd.getTime()
      ).getTime();

      if (ed - sd.getTime() < 0) {
        return;
      } else if (ed - contractHolidayStartPer < 0) {
        return;
      }

      const dayMill = 1000 * 24 * 3600;

      let diff = ed - contractHolidayStartPer + dayMill;

      while (diff > dayMill * (365 + leap(contractHolidayStartPer))) {
        contractHolidayStartPer +=
          dayMill * (365 + leap(contractHolidayStartPer));
        diff -= dayMill * (365 + leap(contractHolidayStartPer));
      }
      const accruedHolidays = calculateAccruedHolidays(
        contractHolidayStartPer,
        ed,
        annualHolidaysAllowance
      );
      setAccruedThisYear(accruedHolidays);

      const statutoryMinimum =
        calculateAnnualHolidaysAllowance(daysWorkedPerWeek);

      const accruedMinimum = calculateAccruedHolidays(
        contractHolidayStartPer,
        ed,
        statutoryMinimum
      );

      const adjustment = Math.max(accruedMinimum - accruedHolidays, 0);

      setadjustment(roundUpAll(adjustment, 1));

      const totalHoliday = calculateTotalHolidays(
        contractHolidayStartPer,
        ed,
        jurisdiction,
        incBankHolidays,
        holidayTaken
      );

      setTotHolidays(totalHoliday);

      const accruedHolidaysRemaing =
        accruedHolidays + holidayCarryOver + adjustment - totalHoliday;

      setTotAccrued(accruedHolidaysRemaing);

      const dPay = calculateDailyPay(
        salary,
        salaryBpMap.get(salaryBasis) as number,
        daysWorkedPerWeek
      );
      setDailyPay(roundUpAllCurrency(dPay));
      const payout = dPay * accruedHolidaysRemaing;
      setTotPayout(
        formatCurrenySymbol(parseFloat(roundUpAllCurrency(payout).toFixed(2)))
      );
      setIsComplete(true);
    }
  };
  useEffect(() => {
    submt();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    startDate,
    endDate,
    salary,
    salaryBasis,
    daysWorkedPerWeek,
    startPeriodSpecified,
    currentHolidayPeriodStartDate,
    jurisdiction,
    annualHolidaysAllowance,
    incBankHolidays,
    holidayCarryOver,
    holidayTaken,
  ]);
  return (
    <div>
      <form
        className="myForm"
        id="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex-container">
          <h2>Employment Details</h2>
        </div>

        <div
          style={{
            color: "red",
            display:
              differenceString(startDate, endDate) < 0 ? "inline" : "none",
          }}
        >
          Start date must be before end date
        </div>
        <p>
          <label>
            Employment start date *
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Employment termination date *
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Gross Salary *{" "}
            <span style={{ color: "red" }}>
              {salary === -1 ? "Please insert the salary" : ""}
            </span>
            <input
              type="number"
              min="0"
              value={salary === -1 ? "" : salary}
              step="any"
              onChange={(e) => {
                if (
                  parseFloat(e.target.value) >= 0 &&
                  !isNaN(parseFloat(e.target.value))
                ) {
                  setGrossSalary(parseFloat(e.target.value));
                } else {
                  setGrossSalary(-1);
                }
              }}
              required
            />
          </label>
        </p>
        <p>
          <label>
            Salary Basis *{" "}
            <select
              value={salaryBasis}
              onChange={(e) => {
                setSalaryBasis(e.target.value);
              }}
              //defaultValue={"Annually"}

              required
            >
              <option value="Annually">Annually</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
          </label>
        </p>
        <p>
          <label>
            Days worked per week *{" "}
            <span style={{ color: "red" }}>
              {daysWorkedPerWeek === -1 || daysWorkedPerWeek > 7
                ? "Please insert a valid number of days"
                : ""}
            </span>
            <input
              type="number"
              min="0"
              max="7"
              step="any"
              value={daysWorkedPerWeek === -1 ? "" : daysWorkedPerWeek}
              required
              onChange={(e) => {
                if (
                  parseFloat(e.target.value) <= 7 ||
                  parseFloat(e.target.value) >= 0
                ) {
                  setDaysWorkedPerWeek(parseFloat(e.target.value));
                } else {
                  setDaysWorkedPerWeek(-1);
                }
              }}
            />
          </label>
        </p>
        <legend>Holiday period start date specified in contract *</legend>
        <p>
          <label className="choice">
            {" "}
            <input
              type="radio"
              checked={startPeriodSpecified}
              onChange={(e) =>
                e.target.checked
                  ? setStartPeriodSpecified(true)
                  : setStartPeriodSpecified(false)
              }
              required
            />{" "}
            Yes{" "}
          </label>
        </p>
        <p>
          <label className="choice">
            {" "}
            <input
              type="radio"
              checked={!startPeriodSpecified}
              onChange={(e) =>
                e.target.checked
                  ? setStartPeriodSpecified(false)
                  : setStartPeriodSpecified(true)
              }
              required
            />{" "}
            No{" "}
          </label>
        </p>
        <div
          style={{
            color: "red",
            display:
              differenceString(currentHolidayPeriodStartDate, endDate) < 0 &&
              startPeriodSpecified
                ? "inline"
                : "none",
          }}
        >
          Start date must be before end date
        </div>
        <p>
          <label style={{ display: startPeriodSpecified ? "inline" : "none" }}>
            Holiday year start
            <input
              type="date"
              value={currentHolidayPeriodStartDate}
              required={startPeriodSpecified ? true : false}
              onChange={(e) => setcurrentHolidayPeriodStartDate(e.target.value)}
            />
          </label>
        </p>
        <p>
          <label>
            Jurisdiction *
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              required
              defaultValue={"England & Wales"}
            >
              <option value="England & Wales">England & Wales</option>
              <option value="Scotland">Scotland</option>
              <option value="Northern Ireland">Northern Ireland</option>
            </select>
          </label>
        </p>
        <h2>Employee Holiday Balance (Termination Year)</h2>
        <p>
          <label>
            Annual holiday allowance *{" "}
            <span style={{ color: "red" }}>
              {annualHolidaysAllowance <
                calculateAnnualHolidaysAllowance(daysWorkedPerWeek) &&
              incBankHolidays
                ? `This is below the statutory minimum of ${calculateAnnualHolidaysAllowance(
                    daysWorkedPerWeek
                  )}`
                : ""}
            </span>{" "}
            <input
              type="number"
              step="any"
              min="0"
              value={
                annualHolidaysAllowance === -1 ? "" : annualHolidaysAllowance
              }
              onChange={(e) => {
                if (parseFloat(e.target.value) >= 0)
                  setAnnualyHolidaysAllowance(parseFloat(e.target.value));
                else setAnnualyHolidaysAllowance(-1);
              }}
              required
              // oninput="validity.valid||(value='');"
            />
          </label>
        </p>
        <legend>Does your allowance include Bank Holidays ? *</legend>
        <p>
          <label className="choice">
            {" "}
            <input
              type="radio"
              checked={incBankHolidays}
              onChange={(e) => {
                e.target.checked
                  ? setIncBankHolidays(true)
                  : setIncBankHolidays(false);
              }}
              required
            />{" "}
            Yes{" "}
          </label>
        </p>
        <p>
          <label className="choice">
            {" "}
            <input
              type="radio"
              checked={!incBankHolidays}
              onChange={(e) => {
                e.target.checked
                  ? setIncBankHolidays(false)
                  : setIncBankHolidays(true);
              }}
              required
            />{" "}
            No{" "}
          </label>
        </p>
        <p>
          <label>
            Carry over from last year *
            <input
              type="number"
              min="0"
              step="any"
              value={holidayCarryOver}
              onChange={(e) =>
                parseFloat(e.target.value) < 0
                  ? setHolidayCarryOver(0)
                  : setHolidayCarryOver(parseFloat(e.target.value))
              }
              required
              // oninput="validity.valid||(value='');"
            />
          </label>
        </p>
        <p>
          <label>
            Holidays taken this year (excluding Bank Holidays) *
            <input
              type="number"
              min="0"
              value={holidayTaken}
              step="any"
              onChange={(e) =>
                parseFloat(e.target.value) < 0
                  ? setHolidayTaken(0)
                  : setHolidayTaken(parseFloat(e.target.value))
              }
              required
              // oninput="validity.valid||(value='');"
            />
          </label>
        </p>
        <div className="flex-container" style={{ width: "103%" }}>
          <div
            className="flex-child"
            id="output"
            style={{
              visibility: isComplete ? "visible" : "hidden",
              background: "white",
              border: "solid 2px black",
              padding: "5px",
              width: "100px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p> Holidays accrued over the period: </p>
              </div>
              <div style={{ marginRight: "20px" }}>
                <p>
                  {" "}
                  <b> + {accruedThisYear}</b>
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p> Holidays carried over: </p>
              </div>
              <div style={{ marginRight: "20px" }}>
                <p>
                  {" "}
                  <b> + {holidayCarryOver}</b>
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p> Statutory leave adjustment: </p>
              </div>
              <div style={{ marginRight: "20px" }}>
                <p>
                  {" "}
                  <b> + {adjustment}</b>
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottom: "solid",
              }}
            >
              <div>
                <p>
                  {" "}
                  Holidays taken {incBankHolidays
                    ? " + Bank Holidays"
                    : ":"}{" "}
                </p>
              </div>
              <div style={{ marginRight: "20px" }}>
                <p>
                  {" "}
                  <b> - {totHolidays}</b>
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p> Accrued holidays remaining: </p>
              </div>
              <div style={{ marginRight: "20px" }}>
                <p>
                  {" "}
                  <b>
                    {" "}
                    {totAccrued === undefined
                      ? null
                      : roundUpAll(totAccrued as number, 1)}
                  </b>
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottom: "solid",
              }}
            >
              <div style={{ marginRight: "20px" }}>
                <p> Payout per day of holiday: </p>
              </div>
              <div style={{ marginRight: "20px" }}>
                <p>
                  {" "}
                  <b>
                    {" "}
                    {dailyPay ? "£" + currencyFormat(dailyPay as number) : null}
                  </b>
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p> Employee Payout: </p>
              </div>
              <div style={{ marginRight: "20px" }}>
                <p>
                  {" "}
                  <b>
                    {" "}
                    {totPayout !== undefined && totPayout !== null
                      ? totPayout
                      : ""}
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
const calculateTotalHolidays = (
  startDate: number,
  endDate: number,
  jurisdiction: string,
  bankHolsIncl: boolean,
  holidaysTaken: number
): number => {
  return (
    holidaysTaken +
    (bankHolsIncl
      ? calculateNumberOfBankHolidays(startDate, endDate, jurisdiction)
      : 0)
  );
};
const calculateDailyPay = (
  salary: number,
  salaryBasis: number,
  daysWorkedPerWeek: number
): number => {
  const pay = (salary * salaryBasis) / (daysWorkedPerWeek * 52);

  return pay;
};
export const differenceString = (start: string, end: string) => {
  return new Date(end).getTime() - new Date(start).getTime();
};
export const calculateAnnualHolidaysAllowance = (
  daysWorkedPerWeek: number
): number => {
  return roundUpAll(Math.min(28, 5.6 * daysWorkedPerWeek), 1);
};

export const leap = (start: number): number => {
  const startDate = new Date(start);

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();
  let subLeap = 0;

  if (leapYear(startYear) && startMonth === 1 && startDay === 29) {
    subLeap = 1;
  }

  const startYearLeap = leapYear(startYear);
  const endYearMill = new Date(start + 365 * 1000 * 24 * 3600);

  const endYear = endYearMill.getFullYear();
  const endYearLeap = leapYear(endYear);
  let l: any = undefined;
  if (startYearLeap) {
    l = new Date(startYear, 1, 29).getTime();
  } else if (endYearLeap) {
    l = new Date(endYear, 1, 29).getTime();
  }
  if (l === undefined) return 0;

  if (l >= start && l <= start + 3600 * 1000 * 24 * (365 + subLeap)) {
    return 1;
  }
  return 0;
};
const leapYear = (year: number) => {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  }

  return false;
};

export const calculateDateDiffMil = (start: Date, end: Date): number => {
  let mil: number = end.getTime() - start.getTime();

  return mil + 3600 * 1000 * 24;
};
const calculateAccruedHolidays = (
  start: number,
  end: number,
  annualHolidayAllowance: number
): number => {
  const daysWorkedToDate = (end - start) / (3600 * 1000 * 24) + 1;

  return roundUpAll(
    (daysWorkedToDate / (365 + leap(start))) * annualHolidayAllowance,
    1
  );
};

const calculateNumberOfBankHolidays = (
  start: number,
  end: number,
  jurisdiction: string,

  mil?: number
): number => {
  let bankHolidaysMill: Array<number> = [];
  switch (jurisdiction) {
    case "England & Wales":
      bankHolidaysMill = englandBkHol.map((el) => new Date(el).getTime());
      break;
    case "Scotland":
      bankHolidaysMill = scotlandBankHol.map((el) => new Date(el).getTime());
      break;
    case "Northern Ireland":
      bankHolidaysMill = northIrBankHol.map((el) => new Date(el).getTime());
      break;
  }

  return bankHolidaysMill.reduce(
    (a, b) => (b > start && b < end ? a + 1 : a),
    0
  );
};

const formatCurrenySymbol = (n: number) => {
  return n < 0
    ? "-£" + currencyFormat(n).substring(1)
    : "£" + currencyFormat(n);
};

export const roundUpAll = (original: number, precision: number): number => {
  const tempOr = original.toString();

  let value;
  if (tempOr.indexOf(".") === -1) return original;
  else {
    value = value = tempOr + "00";
  }
  let up = false;
  for (let i = value.indexOf(".") + 2; i < value.length; i++) {
    const d = value.charAt(i);
    if (d !== "0") {
      up = true;
      break;
    }
  }
  const digits = value.split(".")[1];
  if (up && digits[0] === "9") {
    return Math.round(parseFloat(value));
  } else if (up) {
    const dig = (parseInt(digits[0]) + 1).toString();
    return parseFloat(value.split(".")[0] + "." + dig);
  } else {
    return original;
  }
};

export const roundUpAllCurrency = (original: number): number => {
  const val = original.toFixed(3);
  const split = val.split(".");
  let digit = parseInt(split[1].charAt(1));

  if (
    split[1].charAt(2) === "9" &&
    split[1].charAt(1) === "9" &&
    split[1].charAt(0) === "9"
  )
    return Math.round(original);
  else if (split[1].charAt(2) === "9" && split[1].charAt(1) === "9")
    return parseFloat(
      split[0] + "." + (parseInt(split[0].charAt(0)) + 1).toString() + "0"
    );
  else if (split[1].charAt(2) !== "0") digit += 1;
  return parseFloat(split[0] + "." + split[1].charAt(0) + digit);
};

const currencyFormat = (num: number): string => {
  const ret = num.toFixed(3);
  let digit = null;
  const split = ret.split(".") as Array<string>;
  if (split[1].charAt(2) !== "0") {
    digit = parseInt(split[1].charAt(1)) + 1;
    const str = parseFloat(split[0] + "." + split[1].charAt(0) + digit);

    return str.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } else {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
};
