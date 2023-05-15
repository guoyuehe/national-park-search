/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });
const createTable = require('./script');
test('createTable function generates correct HTML table', () => {
  // create a sample object to pass into the function
  const sampleObject = {
    monday: "9:00-5:00",
    tuesday: "9:00-5:00",
    wednesday: "9:00-5:00",
    thursday: "9:00-5:00",
    friday: "9:00-5:00",
    saturday: "Closed",
    sunday: "Closed"
  };
  
  // create a table element with the expected HTML
  const expectedTable = document.createElement("table");
  expectedTable.innerHTML = `
    <tbody>
      <tr>
        <td style="font-weight: bold;">Monday</td>
        <td>9:00-5:00</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Tuesday</td>
        <td>9:00-5:00</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Wednesday</td>
        <td>9:00-5:00</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Thursday</td>
        <td>9:00-5:00</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Friday</td>
        <td>9:00-5:00</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Saturday</td>
        <td>Closed</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Sunday</td>
        <td>Closed</td>
      </tr>
    </tbody>
  `;
  
  // generate the actual table using the function
  const actualTable = createTable(sampleObject);
  
  // assert that the actual table has the same innerHTML as the expected table
  expect(actualTable.innerHTML)==(expectedTable.innerHTML);
});