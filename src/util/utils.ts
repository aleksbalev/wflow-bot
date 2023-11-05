export function cetDate(inputDate: string): string {
  const date = new Date(inputDate);
  const cetDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Europe/Paris" }),
  );
  const formattedDate = cetDate.toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return formattedDate;
}

export function filterDuplicates(
  array: string[] | number[],
): (string | number)[] {
  const arrayWithoutDuplicates = [];

  const uniqueValues: { [key: string]: boolean } = {};

  for (const item of array) {
    if (!uniqueValues[item]) {
      arrayWithoutDuplicates.push(item);
      uniqueValues[item] = true;
    }
  }

  return arrayWithoutDuplicates;
}
