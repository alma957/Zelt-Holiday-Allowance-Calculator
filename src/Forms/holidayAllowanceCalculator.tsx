import { useState } from "react";

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
  const [endDate, setEndDate] = useState<string>(defDate);
  const [salary, setGrossSalary] = useState<number | undefined>();
  const [salaryBasis, setSalaryBasis] = useState<string>("Annually");
  const [daysWorkedPerWeek, setDaysWorkedPerWeek] = useState<
    number | undefined
  >();
  const [startPeriodSpecified, setStartPeriodSpecified] =
    useState<boolean>(true);
  const [currentHolidayPeriodStartDate, setcurrentHolidayPeriodStartDate] =
    useState<string>(defDate);
  const [jurisdiction, setJurisdiction] = useState<string>("England & Wales");
  const [annualHolidaysAllowance, setAnnualyHolidaysAllowance] = useState<
    number | undefined
  >();
  const [incBankHolidays, setIncBankHolidays] = useState<boolean>(false);
  const [holidayCarryOver, setHolidayCarryOver] = useState<
    number | undefined
  >();
  const [holidayTaken, setHolidayTaken] = useState<number | undefined>();
  const [totHolidays, setTotHolidays] = useState<number | undefined>(0);
  const [bankHolidaysDuringPeriod, setBankHolidaysDuringPeriod] =
    useState<number>(0);
  const [accruedThisYear, setAccruedThisYear] = useState<number>(0);

  const [totAccrued, setTotAccrued] = useState<number | undefined>();
  const [totPayout, setTotPayout] = useState<number | string>();
  const [isComplete, setIsComplete] = useState<boolean>(false);

  return (
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
      <p>
        <label>
          Employment start date *{" "}
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
          Gross Salary *
          <input
            type="number"
            min="0"
            value={salary}
            step="any"
            onChange={(e) => {
              if (parseFloat(e.target.value) < 0) {
                setGrossSalary(0);
              } else {
                setGrossSalary(parseFloat(e.target.value));
              }
            }}
            required
          />
        </label>
      </p>
      <p>
        <label>
          Salary Basis *
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
          Days worked per week *
          <input
            type="number"
            min="0.1"
            max="7"
            step="any"
            value={daysWorkedPerWeek}
            required
            onChange={(e) => setDaysWorkedPerWeek(parseFloat(e.target.value))}
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
      <p>
        <label style={{ display: startPeriodSpecified ? "inline" : "none" }}>
          Current holiday period start date (leave blank if not in contract)
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
          Annual holiday allowance *
          <input
            type="number"
            step="any"
            min="0"
            value={annualHolidaysAllowance}
            onChange={(e) =>
              parseFloat(e.target.value) < 0
                ? ""
                : setAnnualyHolidaysAllowance(parseFloat(e.target.value))
            }
            required
            // oninput="validity.valid||(value='');"
          />
        </label>
      </p>
      <legend>Does allowance include Bank Holidays ? *</legend>
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
          Holidays Taken This Year *
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
      <div className="flex-container">
        <div>
          <button
            id="button"
            onClick={() => {
              if (
                startDate !== undefined &&
                endDate !== undefined &&
                salary !== undefined &&
                salaryBasis !== undefined &&
                daysWorkedPerWeek !== undefined &&
                startPeriodSpecified !== undefined &&
                jurisdiction !== undefined &&
                annualHolidaysAllowance !== undefined &&
                incBankHolidays !== undefined &&
                holidayCarryOver !== undefined &&
                holidayTaken !== undefined
              ) {
                const sdSplit = startDate.split("-").map((el) => parseInt(el));
                const sd = new Date(sdSplit[0], sdSplit[1] - 1, sdSplit[2]);
                const edSplit = endDate.split("-").map((el) => parseInt(el));

                const ed = new Date(
                  edSplit[0],
                  edSplit[1] - 1,
                  edSplit[2]
                ).getTime();

                const contractHolidayStartPeriodSplit = startPeriodSpecified
                  ? currentHolidayPeriodStartDate!
                      .split("-")
                      .map((el) => parseInt(el))
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
                  alert(
                    "Termination date cannot be before start of employment"
                  );
                  return;
                } else if (ed - contractHolidayStartPer < 0) {
                  alert(
                    "Termination date cannot be before current holiday period start date"
                  );
                  return;
                }
                const dayMill = 1000 * 24 * 3600;

                let diff = ed - contractHolidayStartPer + dayMill;

                while (diff > dayMill * (365 + leap(contractHolidayStartPer))) {
                  contractHolidayStartPer +=
                    dayMill * (365 + leap(contractHolidayStartPer));
                  diff -= dayMill * (365 + leap(contractHolidayStartPer));
                }

                setTotHolidays(
                  calculateTotalHolidays(
                    contractHolidayStartPer,
                    ed,
                    jurisdiction,
                    incBankHolidays,
                    holidayTaken
                  )
                );
                const totBankHolidays = calculateNumberOfBankHolidays(
                  contractHolidayStartPer,
                  ed,
                  jurisdiction
                );
                setBankHolidaysDuringPeriod(totBankHolidays);
                const totAccruedRes = calculateAccruedHolidays(
                  contractHolidayStartPer,
                  ed,
                  annualHolidaysAllowance,
                  holidayTaken,
                  incBankHolidays,
                  jurisdiction,
                  holidayCarryOver
                );
                const accruedThisYear = roundUpAll(
                  totAccruedRes - holidayCarryOver,
                  1
                );

                setTotAccrued(totAccruedRes);
                setAccruedThisYear(accruedThisYear);
                setTotPayout(
                  calculatePayout(
                    salary,
                    salaryBpMap.get(salaryBasis) as number,
                    daysWorkedPerWeek,
                    totAccruedRes
                  )
                );

                setIsComplete(true);
              }
            }}
          >
            Calculate
          </button>
        </div>
        <div
          className="flex-child"
          id="output"
          style={{
            visibility: isComplete ? "visible" : "hidden",
          }}
        >
          <p>
            Holidays accrued this year: <b>{accruedThisYear}</b>
          </p>
          <p>
            Bank holidays during period: <b>{bankHolidaysDuringPeriod}</b>
          </p>
          <p>
            Total holidays taken: <b>{totHolidays}</b>
          </p>
          <p>
            Accrued holidays remaining:{" "}
            <b>
              {totAccrued === undefined
                ? null
                : parseFloat((totAccrued as number).toFixed(5))}
            </b>
          </p>

          <p>
            Employee Payout:<b>{totPayout}</b>{" "}
          </p>
        </div>
      </div>
    </form>
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
    calculateNumberOfBankHolidays(startDate, endDate, jurisdiction)
  );
};
export const calculateAnnualHolidaysAllowance = (
  daysWorkedPerWeek: number
): number => {
  return roundUpAll(Math.min(28, 5.6 * daysWorkedPerWeek), 1);
};
export const calculateAnnualCarryOver = (
  allowance: number,
  maxCarry: number
): number => {
  return roundUpAll(Math.min(maxCarry, (1.6 / 5.6) * allowance), 1);
};
export const leap = (start: number): number => {
  const startDate = new Date(start);

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();
  let subLeap = 0;

  if (leapYear(startYear) && startMonth == 1 && startDay === 29) {
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
  annualHolidayAllowance: number,
  holidayTaken: number,
  bankHolidaysIncluded: boolean,
  jurisdiction: string,
  carryOver: number
): number => {
  const daysWorkedToDate = (end - start) / (3600 * 1000 * 24) + 1;

  const nBankHolidays = calculateNumberOfBankHolidays(start, end, jurisdiction);

  return (
    roundUpAll(
      (daysWorkedToDate / (365 + leap(start))) * annualHolidayAllowance +
        carryOver,
      1
    ) -
    holidayTaken +
    (bankHolidaysIncluded ? 0 : nBankHolidays)
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

const calculatePayout = (
  salary: number,
  salaryBasis: number,
  daysWorkedPerWeek: number,
  accruedHolidayRemaining: number
) => {
  const pay =
    ((salary * salaryBasis) / (daysWorkedPerWeek * 52)) *
    accruedHolidayRemaining;
  return pay < 0
    ? "-£" + currencyFormat(pay).substring(1)
    : "£" + currencyFormat(pay);
};

export const roundUpAll = (original: number, precision: number) => {
  const value = original.toFixed(10);

  const digits = value.split(".")[1];
  let rounded: number | undefined = undefined;

  const sDigits = digits[1];
  if (sDigits === "0") {
    return parseFloat(original.toFixed(1));
  } else if (digits[0] === "9") {
    return Math.round(parseFloat(value));
  } else {
    rounded = parseFloat(
      value.split(".")[0] + "." + (parseInt(digits[0]) + 1).toString()
    );
    return rounded;
  }
};

const currencyFormat = (num: number): string => {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
