import "@mantine/core/styles.css";
import { Card, Group, MantineProvider, Select, Stack } from "@mantine/core";
import { Button, Popover, useCombobox, Text } from "@mantine/core";
import { theme } from "./theme";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { fetchCountries } from "./services/countries";
import FlagIcon from "./components/flagIcon";
import PhoneNumberInput from "./components/numberFormat";
import { CountryMap, CountrySelectItem } from "./types";

export default function App() {
  const { token, login } = useAuth();
  const [originalCountries, setOriginalCountries] = useState<CountryMap>({});
  const [countries, setCountries] = useState<CountryMap>({});
  const [selectedCountry, setSelectedCountry] =
    useState<CountrySelectItem | null>(null);
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [error, setError] = useState<string | null>("");
  const handlePhoneInputChange = (value: string) => {
    setPhoneInput(value);
    setError("");
  };
  const handleOnChange = async (value: string) => {
    if (value && originalCountries.hasOwnProperty(value)) {
      const c = originalCountries[value];
      console.log("selectedCountry", c);
      setSelectedCountry({
        value,
        label: `${c.name} (${c.calling_code})`,
        countryCode: value,
        phoneLength: c.phone_length,
        calling_code: c.calling_code,
        id: c.id,
      });
      setPhoneInput("");
      setError("");
    } else {
      setSelectedCountry(null);
    }
  };
  const handleSubmit = async () => {
    console.log("phoneInput", phoneInput);
    const digits = phoneInput.replace(/\D/g, "");
    if (digits.length >= Number(selectedCountry?.phoneLength || 10)) {
      const payload = {
        phone_number: Number(digits),
        country_id: Number(selectedCountry?.id) || 3,
      };
      try {
        if (!token) {
          await login();
        }
        if (token && payload) {
          // await postCountryCode(token, payload);
          console.log("payload", payload);
        }
      } catch (error) {
        console.log("error");
      }
    } else {
      setError("Please enter a valid phone number");
    }
  };
  //TODO this can be a for loop for better performance
  const countryData: Array<CountrySelectItem> = useMemo(
    () =>
      Object.entries(countries).map(([countryCode, country]) => ({
        value: countryCode,
        label: `${country.name} (${country.calling_code})`,
        id: country.id,
        countryCode: countryCode,
        phoneLength: country.phone_length,
        calling_code: country.calling_code,
      })),
    [countries],
  );
  useEffect(() => {
    const initialize = async () => {
      try {
        setError(null);
        if (!token) await login();
        if (token && !Object.keys(originalCountries).length) {
          const data = await fetchCountries(token);
          setOriginalCountries(data);
          setCountries(data);
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setError(err?.message ?? "Something went wrong");
        }
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <MantineProvider theme={theme}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{
          backgroundColor: "#E5F4E3",
          height: "20vh",
          maxWidth: "400px",
          padding: "2rem",
        }}
      >
        <Group>
          <Popover
            width={300}
            position="bottom"
            withArrow
            shadow="md"
            trapFocus
          >
            <Popover.Target>
              <Button
                style={{
                  width: "100px",
                  backgroundColor: "#5DA9E9",
                  padding: 0,
                }}
              >
                <FlagIcon
                  src={selectedCountry?.countryCode.toLowerCase() || "us"}
                />
                <p style={{ margin: "0 0 0 .5rem" }}>
                  {selectedCountry?.calling_code || "+1"}
                </p>
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Select
                dropdownOpened={true}
                placeholder="Pick value"
                data={countryData}
                searchable
                onChange={(value) => value && handleOnChange(value)}
                renderOption={(item) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {
                      <FlagIcon
                        src={(
                          item.option as CountrySelectItem
                        ).countryCode.toLowerCase()}
                      />
                    }
                    <p style={{ margin: "0 0 0 .5rem" }}>{item.option.label}</p>
                  </div>
                )}
              />
            </Popover.Dropdown>
          </Popover>
          <PhoneNumberInput
            value={phoneInput}
            onChange={handlePhoneInputChange}
            phone_length={Number(selectedCountry?.phoneLength) || 10}
            placeholder={`(000) 000-${"0".repeat(Number(selectedCountry?.phoneLength || 10) - 6)}`}
          />
        </Group>
        <Stack>
          <Text size="sm" color="red">
            {error}
          </Text>
          <Button style={{ backgroundColor: "#5DA9E9" }} onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Card>
    </MantineProvider>
  );
}
