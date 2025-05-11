type CurrencyValueProps = {
    currency?: string;
    locale?: string;
    style?: "currency" | "decimal" | "percent";
    currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    removeCurrency?: boolean;
};

export const currencyFormatter = (
    value: number | string,
    {
        currency = "BRL",
        locale = "pt-BR",
        style = "currency",
        currencyDisplay = "symbol",
        minimumFractionDigits,
        maximumFractionDigits,
        removeCurrency = false,
    }: CurrencyValueProps = {}
): string => {
    let formattedValue = new Intl.NumberFormat(locale, {
        style,
        currency,
        currencyDisplay,
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(Number(value));

    if (removeCurrency) {
        formattedValue = formattedValue.replace(currency, "").trim();
    }

    return formattedValue;
};
