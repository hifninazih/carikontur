import "./App.css";
// import useLocalStorage from "./hooks/useLocalStorage";
import Results from "./components/Results";
import { useEffect, useState, useCallback } from "react";

function App() {
  // THEME LOCALSTORAGE
  // use theme from local storage if available or set light theme
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "garden"
  );

  // update state on toggle
  const handleThemeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("garden");
    }
  };
  // set theme state in localstorage on mount & also update localstorage on state change
  useEffect(() => {
    localStorage.setItem("theme", theme as string);
    const localTheme = localStorage.getItem("theme");
    // add custom data-theme attribute to html tag required to update theme using DaisyUI
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      htmlElement.setAttribute("data-theme", localTheme as string);
    }
  }, [theme]);

  const defaultFormData = {
    interval: 0.5,
    tinggi1: "",
    tinggi2: "",
    jarak: "",
  };

  type FormDataType = {
    interval: number;
    tinggi1: number;
    tinggi2: number;
    jarak: number;
  };

  // State untuk form input
  const [formData, setFormData] = useState<FormDataType>(
    localStorage.getItem("formData")
      ? JSON.parse(localStorage.getItem("formData") as string)
      : defaultFormData
  );

  // State untuk hasil hitung
  const [hasil, setHasil] = useState<any>([]);

  const [both, setBoth] = useState<boolean>(false);

  useEffect(() => {
    setBoth(!!formData.tinggi1 && !!formData.tinggi2);
  }, [formData]);

  // useCallback untuk event handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const newValue = parseFloat(value) || "";

      // Update the state
      setFormData((prevData: any) => ({
        ...prevData,
        [name]: newValue,
      }));
    },
    [formData]
  );

  // useEffect to store updated formData in localStorage
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleReset = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      tinggi1: defaultFormData.tinggi1,
      tinggi2: defaultFormData.tinggi2,
      jarak: defaultFormData.jarak,
    }));
  };

  const handleSwitch = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      tinggi1: prevData.tinggi2,
      tinggi2: prevData.tinggi1,
      jarak: prevData.jarak,
    }));
  };

  // useCallback untuk handle submit
  const calculate = useCallback(() => {
    let result = [];
    let intervalInit;
    let lewat;
    // Logic untuk menghitung
    const { interval, tinggi1, tinggi2, jarak } = formData;
    if (!!interval && !!tinggi1 && !!tinggi2 && !!jarak) {
      // If tinggi1 < tinggi2
      if (tinggi1 < tinggi2) {
        intervalInit = Math.ceil(tinggi1 / interval) * interval;
        lewat = Math.ceil((tinggi2 - intervalInit) / interval);
        for (let i = 0; i < lewat; i++) {
          const intervalKe = intervalInit + i * interval;
          const akumulasi =
            ((intervalKe - tinggi1) / (tinggi2 - tinggi1)) * jarak;
          result.push({ intervalKe, akumulasi: akumulasi.toFixed(2) });
        }
        // If tinggi1 > tinggi2
      } else if (tinggi1 > tinggi2) {
        intervalInit = Math.floor(tinggi1 / interval) * interval;
        lewat = Math.ceil((intervalInit - tinggi2) / interval);
        for (let i = 0; i < lewat; i++) {
          const intervalKe = intervalInit - i * interval;
          let akumulasi =
            ((intervalKe - tinggi1) / (tinggi2 - tinggi1)) * jarak;
          result.push({ intervalKe, akumulasi: akumulasi.toFixed(2) });
        }
      }
      if (intervalInit === tinggi1) {
        result.shift();
      }
    }
    setHasil(result);
    // console.log(result);
  }, [formData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calculate();
    }, 500);
    return () => clearTimeout(timer);
  }, [calculate]); // Gunakan calculate sebagai dependensi useEffect, bukan formData

  return (
    <>
      <div className="container md:w-2/3 lg:max-w-2xl mx-auto px-4 py-8 h-dvh font-mono">
        <div className="flex justify-between items-center my-4 gap-2">
          <h1 className="text-sm md:text-3xl font-bold hidden lg:block">
            Cari Kontur
          </h1>
          <label className="cursor-pointer grid place-items-center">
            <input
              type="checkbox"
              value="night"
              onChange={handleThemeToggle}
              checked={theme === "dark"}
              className="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2"
            />

            <svg
              className="col-start-1 row-start-1 stroke-base-100 fill-base-100"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <svg
              className="col-start-2 row-start-1 stroke-base-100 fill-base-100"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
          <div className="flex flex-row gap-2">
            <label className="input input-sm input-bordered input-outline input-ghost flex items-center gap-2 w-f">
              <span className="badge badge-sm">Interval</span>
              <input
                type="number"
                className="w-full text-center"
                onChange={handleInputChange}
                value={formData.interval}
                placeholder=""
                name="interval"
                tabIndex={-1}
              />
              <span className="badge badge-sm">m</span>
            </label>

            <button
              className="btn btn-sm btn-square btn-outline"
              onClick={handleReset}
              tabIndex={-1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-y-4">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="flex-grow flex justify-end">
              <input
                id="tab-first"
                type="number"
                onChange={handleInputChange}
                value={formData.tinggi1}
                name="tinggi1"
                placeholder="Tinggi 1 (m)"
                className="input input-bordered w-full text-center"
                tabIndex={1}
              />
            </div>
            <div className="flex justify-center">
              <button
                className={`btn btn-sm btn-square btn-outline ${
                  both ? "btn-outline" : "btn-disabled"
                }`}
                onClick={handleSwitch}
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 scale-90 rotate-90"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                >
                  <path d="M14.30273.61464c-.56104-.23389-1.20654-.104-1.63477.3252L5.68506 7.92275c-.58594.58545-.58594 1.53565 0 2.12109.58594.58594 1.53516.58594 2.12109 0l4.42236-4.42236v24.37891c0 .82861.67139 1.5 1.5 1.5s1.5-.67139 1.5-1.5v-28C15.22852 1.39345 14.86328.84657 14.30273.61464zM26.31494 21.95692c-.58594-.58594-1.53516-.58594-2.12109 0l-4.42236 4.42236V2.00038c0-.82861-.67139-1.5-1.5-1.5s-1.5.67139-1.5 1.5v28c0 .60693.36523 1.15381.92578 1.38574.18555.07715.38086.11426.57373.11426.39063 0 .77441-.15234 1.06104-.43945l6.98291-6.98291C26.90088 23.49257 26.90088 22.54237 26.31494 21.95692z"></path>
                </svg>
              </button>
            </div>
            <div className="flex-grow flex justify-start">
              <input
                type="number"
                onChange={handleInputChange}
                value={formData.tinggi2}
                name="tinggi2"
                placeholder="Tinggi 2 (m)"
                className="input input-bordered  w-full text-center"
                tabIndex={2}
              />
            </div>
          </div>

          <div className="w-full text-center">
            <input
              type="number"
              onChange={handleInputChange}
              value={formData.jarak}
              name="jarak"
              placeholder="Jarak di peta (cm)"
              className="input input-bordered w-full text-center"
              tabIndex={3}
            />
          </div>
          <input
            type="number"
            tabIndex={4}
            className="absolute top-0 left-0 -translate-x-full bg-rose-200"
            onFocus={() => document.getElementById("tab-first")?.focus()}
          />
        </div>

        <div className="w-full mt-4">
          <Results hasil={hasil} />
        </div>
      </div>
    </>
  );
}

export default App;
