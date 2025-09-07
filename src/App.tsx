import "@mantine/core/styles.css";
import {
  Card,
  Group,
  Input,
  MantineProvider,
  Select,
  Stack,
} from "@mantine/core";
import {
  Button,
  Popover,
  Combobox,
  useCombobox,
  Text,
  NumberInput,
  Box,
} from "@mantine/core";
import { theme } from "./theme";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { fetchCountries, postCountryCode } from "./services/countries";
import FlagIcon from "./components/flagIcon";
import PhoneNumberInput from "./components/numberFormat";
export type Country = {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
  countryCode?: string;
};
type CountryMap = Record<string, Country>;
export default function App() {
  const { token, isAuthenticated, login } = useAuth();
  const [originalCountries, setOriginalCountries] = useState<CountryMap>({});
  const [countries, setCountries] = useState<CountryMap>({});

  const [selectedCountry, setSelectedCountry] =
    useState<CountrySelectItem | null>(null);
  const [phoneInput, setPhoneInput] = useState<string>("");
  const handlePhoneInputChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    console.log("digits", digits);
    console.log("value", value);
    setPhoneInput(value);
  };
  console.log("phoneInput", phoneInput);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  type CountrySelectItem = {
    value: string;
    label: string;
    countryCode: string;
    phoneLength: string;
    calling_code?: string;
    id: string;
  };
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
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  console.log("selectedCountry", selectedCountry);

  console.log("countryData", countryData);
  useEffect(() => {
    (async () => {
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
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <MantineProvider theme={theme}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group>
          <Popover width={300} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button
                style={{ width: "100px", backgroundColor: "grey", padding: 0 }}
              >
                <FlagIcon
                  src={selectedCountry?.countryCode.toLowerCase() || "us"}
                />
                <p style={{ margin: "0 0 0 .5rem" }}>
                  {selectedCountry?.calling_code}
                </p>
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Select
                dropdownOpened={true}
                placeholder="Pick value"
                data={countryData}
                searchable
                onChange={(value) => {
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
                }}
                renderOption={(item) => (
                  <div>
                    {
                      <FlagIcon
                        src={(
                          item.option as CountrySelectItem
                        ).countryCode.toLowerCase()}
                      />
                    }
                    {item.option.label}
                  </div>
                )}
              />
            </Popover.Dropdown>
          </Popover>
          <PhoneNumberInput
            value={phoneInput}
            onChange={setPhoneInput}
            phone_length={Number(selectedCountry?.phoneLength) || 10}
            placeholder={`(000) 000-${"0".repeat(Number(selectedCountry?.phoneLength) - 5)}`}
            // setError={setError}
          />
        </Group>
        <Stack>
          <Text size="sm" color="red">
            {error}
          </Text>
          <Button
            onClick={async () => {
              console.log("phoneInput", phoneInput);
              const digits = phoneInput.replace(/\D/g, "");
              if (digits.length >= Number(selectedCountry?.phoneLength)) {
                const payload = {
                  phone_number: Number(digits),
                  country_id: Number(selectedCountry?.id),
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
            }}
          >
            Submit
          </Button>
        </Stack>
      </Card>
    </MantineProvider>
  );
}
