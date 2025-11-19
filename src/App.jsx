import { useState, useEffect } from "react";
import "./index.css";
/*
// 7 - Внедрите логику отображения загрузки и ошибок в интерфейсе.
// 8 - Добавьте проверку, чтобы amount был больше 0.
*/

//https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD

function App() {

  const [amount, setAmount] = useState(1);
  const [currency, setCurrency] = useState("EUR");
  const [changeCurrency, setChangeCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currencyList, setCurrencyList] = useState({});
  const [result, setResult] = useState({});

  const API_URL = "https://api.frankfurter.app/";


  useEffect(() => {
    async function fetchData() {
      setDataLoading(true);
      try {
        const res = await fetch(API_URL + "currencies");
        if (!res.ok) {
          throw new Error("Сервер не доступен");
        }
        const data = await res.json();
        setCurrencyList(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setDataLoading(false);
      }
    }
    fetchData();
  }, []);


    async function convert() {
      setError(null);
      if (Number(amount) < 1) {
        setResult({});
        setError("Должно быть целое неотрицательное число");
        return;
      }
      setLoading(true);
      try {
        if (currency === changeCurrency) {
          throw new Error("Выберите разные валюты");
        }
        const res = await fetch(
          API_URL + `latest?amount=${amount}&from=${currency}&to=${changeCurrency}`
        );
        if (!res.ok) {
          throw new Error("Сервер не доступен");
        }
        const convertData = await res.json();
        setResult(convertData)
      } catch (err) {
        setResult({})
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

  return (
    <div className="app">
      <h1>Калькулятор обмена валюты</h1>
      {dataLoading && (
        <p className="loading">Загрузка списка валют...</p>
      )}
      {!dataLoading && (
        <div className="converter-container">
          {error && (<p className="error">{error}</p>)}

          <div className="input-group">
            <input
              value={amount}
              type="number"
              placeholder="Сумма"
              className="input-field"
              onChange={(e) => {
                setAmount(e.target.value)
                setError(null)
              }}
            />
            <select
              value={currency}
              className="dropdown"
              onChange={(e) => {
                setCurrency(e.target.value)
                setError(null)
            }}
            >
              {Object.keys(currencyList).map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>

            <span className="arrow">→</span>

            <select
              value={changeCurrency}
              className="dropdown"
              onChange={(e) => setChangeCurrency(e.target.value)}
            >
              {Object.keys(currencyList).map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}

            </select>
          </div>
          <button
            onClick={() => convert()}
            className="convert-button"
          >
            Конвертировать
          </button>
          {loading && !error && (<p className="loading">Конвертация...</p>)}
          {!loading && result?.rates?.[changeCurrency] && (
            <p className="result">
              {result.rates[changeCurrency]} {changeCurrency}
            </p>
          )}
        </div>
      )
      }

    </div>
  );
}

export default App;
