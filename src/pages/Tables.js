import { openDatabase } from "react-native-sqlite-storage";

const db = openDatabase({ name: "prefaena.db" });

class Tables {
  //Crear tablas generales
  async createTables() {
    //Tickets
    this.createTableTickets();
    this.createTableTicketsDetalle();
    this.createSincroCuadrilla();
    this.createSincroMetodoRecoleccion();
    this.createSincroMotivosCancelacion();
    this.createPrinter();
    this.createGalpon();
  }

  createTableTickets = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table'AND name='tickets'",
        [],
        function (tx, res) {
          ////console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql("DROP TABLE IF EXISTS tickets", []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS tickets(id INTEGER PRIMARY KEY AUTOINCREMENT" +
                " , IdPDA INTEGER" +
                " , IdMetodoRecolec INTEGER" +
                " , NumTicket VARCHAR(15)" +
                " , NumOrdenTrans VARCHAR(15)" +
                " , PlacaVehiculo VARCHAR(10)" +
                " , FechaRecoleccion DATE" +
                " , FLEstatus VARCHAR(2)" +
                " , Conductor VARCHAR(50)" +
                " , Remolque1 VARCHAR(50)" +
                " , Remolque2 VARCHAR(50)" +
                " , GranjaLote VARCHAR(20)" +
                " , desGranja VARCHAR(30)" +
                " , IdCuadrillaProgramado VARCHAR(15)" +
                " , DesCuadrilla VARCHAR(60)" +
                " , FechaProgramacion DATETIME" +
                " , TotalAnimales INTEGER" +
                " , CantidadJaulas INTEGER" +
                " , AnimalesPJaulas NUMERIC" +
                " , Observaciones VARCHAR(300)" +
                " , FechaEntradaCuadrilla DATETIME" +
                " , FechaInicioRecepcion DATETIME" +
                " , FechaFinalRecepcion DATETIME" +
                " , FechaEntradaTransporte DATETIME" +
                " , FechaSalidaTransporte DATETIME" +
                " , IdCuadrillaReal VARCHAR(15)" +
                " , NR_GAIOVAZIORDEPESA INTEGER" +
                " , MetodoRecolecReal INTEGER" +
                " , FLEstatusPda VARCHAR(2)" +
                " , FechaSincronizacionPDA DATETIME" +
                " , FechaSincronizacionPDA2 DATETIME" +
                " , IdMotivoCancelacion INTEGER" +
                " , DesMotivoCancelacion VARCHAR(70)" +
                " , ObserMotivoCancelacion VARCHAR(300)" +
                " , FechaCancelacion DATETIME" +
                " , IdUsuarioCancelacion INTEGER, IdOrden INTEGER)",
              []
            );
            console.log("Tabla Tikets creada exitósamente...");
          }
        }
      );
    });
  };

  createTableTicketsDetalle = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table'AND name='TicketsDetalle'",
        [],
        function (tx, res) {
          ////console.log("item:", res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql("DROP TABLE IF EXISTS TicketsDetalle", []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS TicketsDetalle(id INTEGER PRIMARY KEY AUTOINCREMENT" +
                " , ID_GALPORDEPESA NUMERIC" +
                " , IdOrden NUMERIC" +
                " , GalponReal VARCHAR(15)" +
                " , TotalAnimalesReal NUMERIC" +
                " , CantidadJaulasReal INTEGER" +
                " , AnimalesPJaulasReal NUMERIC" +
                " , FechaRetiradaAlimento DATETIME)",
              []
            );
            console.log("Tabla TicketsDetalle creada exitósamente...");
          }
        }
      );
    });
  };

  createSincroCuadrilla = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table'AND name='SincroCuadrilla'",
        [],
        function (tx, res) {
          ////console.log("item:", res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql("DROP TABLE IF EXISTS SincroCuadrilla", []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS SincroCuadrilla (id INTEGER PRIMARY KEY AUTOINCREMENT" +
                " , IdCuadrilla VARCHAR(15)" +
                " , DesCuadrilla VARCHAR(60))",
              []
            );
            console.log("Tabla Tikets creada SincroCuadrilla...");
          }
        }
      );
    });
  };

  createGalpon = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table'AND name='SincroGalpones'",
        [],
        function (tx, res) {
          ////console.log("item:", res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql("DROP TABLE IF EXISTS SincroGalpones", []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS SincroGalpones (id INTEGER PRIMARY KEY AUTOINCREMENT" +
                " , Galpon VARCHAR(15)" +
                " , GranjaLote VARCHAR(60))",
              []
            );
            console.log("Tabla SincroGalpones creada...");
          }
        }
      );
    });
  };

  createSincroMotivosCancelacion = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table'AND name='SincroMotivosCancelacion'",
        [],
        function (tx, res) {
          ////console.log("item:", res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql("DROP TABLE IF EXISTS SincroMotivosCancelacion", []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS SincroMotivosCancelacion  (id INTEGER PRIMARY KEY AUTOINCREMENT" +
                " , IdMotivoCancelacion INTEGER" +
                " , DesMotivoCancelacion VARCHAR(60))",
              []
            );
            console.log("Tabla Tikets creada SincroMotivosCancelacion...");
          }
        }
      );
    });
  };

  createPrinter = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Printer'",
        [],
        function (tx, res) {
          ////console.log("item:", res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql("DROP TABLE IF EXISTS Printer", []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS Printer (id INTEGER PRIMARY KEY AUTOINCREMENT" +
                " , mac VARCHAR(50))",
              []
            );
            txn.executeSql(
              "CREATE TRIGGER befor_ins_Printer BEFORE INSERT ON Printer BEGIN delete FROM Printer; END",
              []
            );
            //console.log("Tabla Printer creada...");
          }
        }
      );
    });
  };

  
  createSincroMetodoRecoleccion = () => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table'AND name='SincroMetodoRecoleccion'",
        [],
        function (tx, res) {
          ////console.log("item:", res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql("DROP TABLE IF EXISTS SincroMetodoRecoleccion", []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS SincroMetodoRecoleccion  (id INTEGER PRIMARY KEY AUTOINCREMENT" +
                " , IdMetodoRecolec INTEGER" +
                " , desMetodoRecolec VARCHAR(20), AbrevMetodoRecolec VARCHAR(5))",
              []
            );
            console.log("Tabla Tikets creada SincroMetodoRecoleccion...");
          }
        }
      );
    });
  };
}

const crtTable = new Tables();

export default crtTable;
