/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import { ListItem, Divider } from "react-native-elements";
import crud from "./Crud";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/FontAwesome";
import RNZebraBluetoothPrinter from "react-native-zebra-bluetooth-printer";

//mac 00:22:58:02:11:E2

const inputStyle = {
  borderRadius: 5,
  borderWidth: 1,
  borderColor: "gray",
  padding: 12,
  color: "black",
  fontFamily: "Ubuntu",
  marginBottom: 5,
};

const Impresora = ({ navigation, route }) => {
  const [table, setTable] = useState([]);
  var [table5, setTable5] = useState("0");
  const [printid, setPrintId] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  //List medoto de recoleccion
  async function SelectTickets() {
    let query = "select substr(a.desGranja|| '          ', 1, 10) desGranja";
        query += " , a.NumTicket"
        query += " , substr(a.PlacaVehiculo|| '      ', 1, 6) PlacaVehiculo";
        query += " , case when sum(b.TotalAnimalesReal) is null then 0 else sum(b.TotalAnimalesReal) end TotalAnimalesReal";
        query += " from tickets a, TicketsDetalle b";
        query += " where a.IdOrden = b.IdOrden";
        query += " group by a.desGranja, a.NumTicket, a.PlacaVehiculo order by a.NumTicket";


    let selectQuery = await crud.ExecuteQuery(query, []);
    var rows = selectQuery.rows;
    var temp = [];
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setTable(temp);
  }


  function handleBackButtonClick() {
    //navigation.goBack();
    navigation.navigate("Recolectar");
    return true;
  }

  //Hook
  useEffect(() => {
    SelectTickets();
    SelectPrinterId();
    SelectSumAnimalesPorJaulasReal();

    //console.log(table1);

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    if (month < 10) {
      month = "0" + month;
    }
    if (min < 10) {
      min = "0" + min;
    }
    setCurrentDate(
      date + "/" + month + "/" + year + " " + hours + ":" + min + ":" + sec
    );

    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

     //Default value for metodo
  async function SelectPrinterId() {
    let query = "select mac from Printer";
    let selectQuery = await crud.ExecuteQuery(query, []);
    var rows = selectQuery.rows;
    //console.log(rows.length);
    if (selectQuery.rows.length > 0) {
      setPrintId(rows.item(0).mac);
    }
  }

  async function SelectSumAnimalesPorJaulasReal() {
    setTable5(0);
    let query =
      "select case when sum(TotalAnimalesReal) is null then 0 else sum(TotalAnimalesReal) end TotalAnimalesReal from TicketsDetalle";
    let selectQuery = await crud.ExecuteQuery(query, []);
    var rows = selectQuery.rows;
    if (selectQuery.rows.length > 0) {
      setTable5(rows.item(0).TotalAnimalesReal);
    }
  }

  const items = table.map(
    (key) =>
      " " +
      key.desGranja +
      "       |" +
      key.NumTicket +
      "          |" +
      key.PlacaVehiculo +
      "           |" +
      key.TotalAnimalesReal +
      "\r\n"
  );

  

  function isNUll(param) {
    if (param == null) {
      return "";
    } else {
      return param;
    }
  }

  const print = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    SelectSumAnimalesPorJaulasReal();

    const printerSerial = String(printid);

    
    var cpcl =
      "! 0 200 250 950 1\r\n" +
      "T 4 1 100 250 Cierre de Prefaena\r\n" +
      "TEXT 7 1 550 200 " +
      currentDate +
      "\r\n" +
      "ML 30\r\n" +
      "T 7 0 30 340\r\n" +
      "\r\n" +
      "\r\n" +
      "  Granja          |Ticket               |Placa            |Aves\r\n"
        .concat(items)
        .replace(/,/g, "") +
      "\r\n" +
      "Total Aves Prefaena\r\n" +
       table5 + "\r\n" +
      "ENDML\r\n" +
      "PRINT\r\n";

    //console.log(cpcl);

    //const zpl = "^XA^FX Top section with company logo, name and address.^CF0,60^FO50,50^GB100,100,100^FS^ FO75,75 ^ FR ^ GB100, 100, 100 ^ FS^ FO88, 88 ^ GB50, 50, 50 ^ FS ^XZ";

    RNZebraBluetoothPrinter.print(printerSerial, cpcl)
      .then((res) => {
        //do something with res
        console.log("print: ", res);
        if (res) {
          //console.log(cpcl);
          Alert.alert("Mensaje", "Ticket impreso");
        }
      })
      .catch((error) => Alert.alert("Error", error.message));
  };

  const connectDevice = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    const printerSerial = String(printid);
    RNZebraBluetoothPrinter.connectDevice(printerSerial)
      .then((res) => {
        //do something with res
        //console.log("print: ", res);
        Alert.alert("Impresora emparejada", res);
      })
      .catch((error) => Alert.alert("Error", error.message));
  };

  const enableBt = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    const printerSerial = String(printid);
    RNZebraBluetoothPrinter.enableBluetooth()
      .then((res) => {
        //do something with res
        console.log("Bt: ", res);
      })
      .catch((error) => console.log(error.message));
  };

  const disableBt = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    const printerSerial = String(printid);
    RNZebraBluetoothPrinter.disableBluetooth()
      .then((res) => {
        //do something with res
        console.log("Bt: ", res);
      })
      .catch((error) => console.log(error.message));
  };

  /*
  const scanDevice = async () => {
    //Store your printer serial or mac, ios needs serial, android needs mac
    const printerSerial = String(printid);
    RNZebraBluetoothPrinter.scanDevices()
      .then((res) => {
        //do something with res
        console.log("scan: ", res);
      })
      .catch((error) => console.log(error.message));
  };*/

  return (
    <ScrollView style={styles.scrollView}>
      <Divider style={{ backgroundColor: "#FFF", height: 10 }} />
            <Grid>
        <Row size={2}>
          <Col>
            <TouchableOpacity style={styles.BtnEstatus} onPress={() => print()}>
              <Text style={styles.btnText}>Imprimir</Text>
              <Icon color="#00843D" name="print" size={25} />
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity
              style={styles.BtnEstatus}
              onPress={() => enableBt()}
            >
              <Text style={styles.btnText}>Act.Bt</Text>
              <Icon color="#00843D" name="bluetooth" size={25} />
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity
              style={styles.BtnEstatus}
              onPress={() => disableBt()}
            >
              <Text style={styles.btnText}>Des.Bt</Text>
              <Icon color="#00843D" name="bluetooth-b" size={25} />
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity
              style={styles.BtnEstatus}
              onPress={() => connectDevice()}
            >
              <Text style={styles.btnText}>Mostrar Imp</Text>
              <Icon color="#00843D" name="link" size={25} />
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
      <Divider style={{ backgroundColor: "#FFF", height: 10 }} />

      {table.map((item, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Granja: </Text>
              {item.desGranja}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Nro.Ticket: </Text>
              {item.NumTicket}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Vehiculo: </Text>
              {item.PlacaVehiculo}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle1}>Total Aves: </Text>
              {item.TotalAnimalesReal}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  formContainer: {
    backgroundColor: "#fff",
    height: "100%",
    width: "96%",
    marginLeft: "2%",
    fontFamily: "Ubuntu",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Ubuntu",
  },
  subtitle1: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Ubuntu",
  },
  loginBtn: {
    backgroundColor: "#00843D",
    borderRadius: 5,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  BtnEstatus: {
    backgroundColor: "#E6E1C5",
    borderRadius: 5,
    width: "99%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  BtnDetalle: {
    backgroundColor: "#012169",
    borderRadius: 5,
    height: 60,
    width: "99%",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  loginText: {
    color: "white",
  },
  btnText: {
    color: "black",
  },
  text: {
    fontFamily: "Ubuntu",
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Ubuntu",
    textAlign: "center",
  },
  pickerStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    fontFamily: "Ubuntu",
    marginBottom: 5,
  },
});

export default Impresora;
