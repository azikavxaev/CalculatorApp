import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Switch,
  SafeAreaView,
  Platform,
  StatusBar,
  Appearance,
  TouchableWithoutFeedback,
  Keyboard,
  AppState,
} from "react-native";
import ButtonComponent from "../components/ButtonComponent";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { column, evaluate, exp, expression, re } from "mathjs";
import { parenthesisIsNeeded } from "../utils/parenthesisIsNeeded.js";
import { dotCanBeAdded } from "../utils/dotCounter.js";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const entireHeight = Dimensions.get("screen").height;

const ButtonTestNew = () => {
  const [firstValue, setFirstValue] = useState("");
  const [result, setResult] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      Keyboard.dismiss
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  useEffect(() => {
    setResult(resultHandler);
    console.log(
      Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 5,
      })
        .format(+parseFloat(result))
        ?.toString().length
    );
  }, [firstValue]);

  function resultHandler() {
    const expression = firstValue.replaceAll("×", "*");
    if (
      ["-", "+", "/", "*", "^", "(", "."].includes(expression.slice(-1)) ||
      parenthesisIsNeeded(expression)
    ) {
      setResult(result);
    } else {
      setResult(evaluate(expression));
    }
  }

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          backgroundColor: isDarkMode ? "#0c0c15ff" : "#b1b1b167",
        }}
      >
        <View style={styles.upperContainer}>
          <View style={styles.expressionContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={() => {
                setIsDarkMode((state) => {
                  return !state;
                });
              }}
              thumbColor={isDarkMode ? "#ffffffd1" : "#0c0c15b6"}
              trackColor={{ false: "#8c8c9265", true: "#ffffff75" }}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
              accessible={false}
            >
              <TextInput
                style={{
                  fontSize:
                    firstValue.length < 11
                      ? windowWidth / 7
                      : firstValue.length < 14
                      ? windowWidth / 9
                      : windowWidth / 11,
                  color: isDarkMode ? "white" : "black",
                }}
                showSoftInputOnFocus={false}
                defaultValue={firstValue}
                selection={selection}
                contextMenuHidden={true}
                onSelectionChange={({ nativeEvent: { selection } }) => {
                  setSelection({ start: selection.end, end: selection.end });
                }}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultStyle,
                {
                  color: isDarkMode ? "white" : "black",
                  fontSize:
                    Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 5,
                    })
                      .format(+parseFloat(result))
                      ?.toString().length < 16
                      ? windowWidth / 9
                      : Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 5,
                        })
                          .format(+parseFloat(result))
                          ?.toString().length < 19n
                      ? windowWidth / 11.5
                      : windowWidth / 14,
                },
              ]}
            >
              {result == "Infinity"
                ? "Can`t divide by 0"
                : result || result == 0
                ? Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 5,
                  }).format(+parseFloat(result))
                : null}
            </Text>
          </View>
        </View>
        <View style={styles.numpadContainer}>
          <View style={styles.buttonRow}>
            <ButtonComponent
              isDarkMode={isDarkMode}
              buttonValue="()"
              styleText={{ color: isDarkMode ? "white" : "black" }}
              style={{
                backgroundColor: isDarkMode ? "#363638df" : "#ffffffd6",
              }}
              onPressProp={() => {
                if (
                  ["-", "+", "/", "×", "^", "(", "."].includes(
                    firstValue[selection.start - 1]
                  ) ||
                  selection.start == 0
                ) {
                  setFirstValue(
                    firstValue.slice(0, selection.start) +
                      "(" +
                      firstValue.slice(selection.start)
                  );
                  setSelection({
                    start: selection.start + 1,
                    end: selection.end + 1,
                  });
                } else if (
                  ["%", ")"].includes(firstValue[selection.start - 1])
                ) {
                  if (parenthesisIsNeeded(firstValue)) {
                    setFirstValue(
                      firstValue.slice(0, selection.start) +
                        ")" +
                        firstValue.slice(selection.start)
                    );
                    setSelection({
                      start: selection.start + 1,
                      end: selection.end + 1,
                    });
                  } else {
                    setFirstValue(
                      firstValue.slice(0, selection.start) +
                        "(" +
                        firstValue.slice(selection.start)
                    );
                    setSelection({
                      start: selection.start + 1,
                      end: selection.end + 1,
                    });
                  }
                } else {
                  if (parenthesisIsNeeded(firstValue)) {
                    setFirstValue(
                      firstValue.slice(0, selection.start) +
                        ")" +
                        firstValue.slice(selection.start)
                    );
                    setSelection({
                      start: selection.start + 1,
                      end: selection.end + 1,
                    });
                  } else {
                    null;
                  }
                }
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              buttonValue="^"
              styleText={{ color: isDarkMode ? "white" : "black" }}
              style={{
                backgroundColor: isDarkMode ? "#363638df" : "#ffffffd6",
              }}
              onPressProp={() => {
                if (!firstValue || firstValue[selection.start - 1] == "(") {
                  null;
                } else if (
                  ["+", "/", "×", "%", "^"].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start != firstValue.length
                ) {
                  setFirstValue(
                    firstValue.slice(0, selection.start - 1) +
                      "^" +
                      firstValue.slice(selection.start)
                  );
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 2]
                  )
                ) {
                  null;
                } else if (
                  ["-", "+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start == firstValue.length
                ) {
                  if (firstValue.slice(-2) == "(-") {
                    null;
                  } else {
                    setFirstValue(
                      firstValue.slice(0, selection.start - 1) + "^"
                    );
                  }
                } else if (
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start]
                  )
                ) {
                  null;
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  firstValue[selection.start] == "("
                ) {
                  null;
                } else {
                  setFirstValue(
                    firstValue.slice(0, selection.start) +
                      "^" +
                      firstValue.slice(selection.start)
                  );
                  setSelection({
                    start: selection.start + 1,
                    end: selection.end + 1,
                  });
                }
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              buttonValue="%"
              styleText={{ color: isDarkMode ? "white" : "black" }}
              style={{
                backgroundColor: isDarkMode ? "#363638df" : "#ffffffd6",
              }}
              onPressProp={() => {
                if (!firstValue || firstValue[selection.start - 1] == "(") {
                  null;
                } else if (
                  ["+", "/", "×", "%", "^"].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start != firstValue.length
                ) {
                  setFirstValue(
                    firstValue.slice(0, selection.start - 1) +
                      "%" +
                      firstValue.slice(selection.start)
                  );
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 2]
                  )
                ) {
                  null;
                } else if (
                  ["-", "+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start == firstValue.length
                ) {
                  if (firstValue.slice(-2) == "(-") {
                    null;
                  } else {
                    setFirstValue(
                      firstValue.slice(0, selection.start - 1) + "%"
                    );
                  }
                } else if (
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start]
                  )
                ) {
                  null;
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  firstValue[selection.start] == "("
                ) {
                  null;
                } else {
                  setFirstValue(
                    firstValue.slice(0, selection.start) +
                      "%" +
                      firstValue.slice(selection.start)
                  );
                  setSelection({
                    start: selection.start + 1,
                    end: selection.end + 1,
                  });
                }
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              buttonValue="/"
              styleText={{ color: "black" }}
              style={{
                backgroundColor: isDarkMode ? "#ffffffbc" : "#686868d6",
              }}
              onPressProp={() => {
                if (!firstValue || firstValue[selection.start - 1] == "(") {
                  null;
                } else if (
                  ["+", "/", "×", "%", "^"].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start != firstValue.length
                ) {
                  setFirstValue(
                    firstValue.slice(0, selection.start - 1) +
                      "/" +
                      firstValue.slice(selection.start)
                  );
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 2]
                  )
                ) {
                  null;
                } else if (
                  ["-", "+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start == firstValue.length
                ) {
                  if (firstValue.slice(-2) == "(-") {
                    null;
                  } else {
                    setFirstValue(
                      firstValue.slice(0, selection.start - 1) + "/"
                    );
                  }
                } else if (
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start]
                  )
                ) {
                  null;
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  firstValue[selection.start] == "("
                ) {
                  null;
                } else {
                  setFirstValue(
                    firstValue.slice(0, selection.start) +
                      "/" +
                      firstValue.slice(selection.start)
                  );
                  setSelection({
                    start: selection.start + 1,
                    end: selection.end + 1,
                  });
                }
              }}
            />
          </View>
          <View style={styles.buttonRow}>
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={7}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "7" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={8}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "8" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={9}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "9" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              buttonValue="×"
              styleText={{ color: "black" }}
              style={{
                backgroundColor: isDarkMode ? "#ffffffbc" : "#686868d6",
              }}
              onPressProp={() => {
                if (!firstValue || firstValue[selection.start - 1] == "(") {
                  null;
                } else if (
                  ["+", "/", "×", "%", "^"].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start != firstValue.length
                ) {
                  setFirstValue(
                    firstValue.slice(0, selection.start - 1) +
                      "×" +
                      firstValue.slice(selection.start)
                  );
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 2]
                  )
                ) {
                  null;
                } else if (
                  ["-", "+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start == firstValue.length
                ) {
                  if (firstValue.slice(-2) == "(-") {
                    null;
                  } else {
                    setFirstValue(
                      firstValue.slice(0, selection.start - 1) + "×"
                    );
                  }
                } else if (
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start]
                  )
                ) {
                  null;
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  firstValue[selection.start] == "("
                ) {
                  null;
                } else {
                  setFirstValue(
                    firstValue.slice(0, selection.start) +
                      "×" +
                      firstValue.slice(selection.start)
                  );
                  setSelection({
                    start: selection.start + 1,
                    end: selection.end + 1,
                  });
                }
              }}
            />
          </View>
          <View style={styles.buttonRow}>
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={4}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "4" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={5}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "5" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={6}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "6" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              buttonValue="-"
              styleText={{ color: "black" }}
              style={{
                backgroundColor: isDarkMode ? "#ffffffbc" : "#686868d6",
              }}
              onPressProp={() => {
                if (
                  firstValue[selection.start - 1] == "-" ||
                  firstValue[selection.start] == "-" ||
                  firstValue[selection.start + 1] == "-" ||
                  firstValue[selection.start] == "."
                ) {
                  null;
                } else if (
                  [".", "+"].includes(firstValue[selection.start - 1])
                ) {
                  {
                    setFirstValue(
                      firstValue.slice(0, selection.start - 1) +
                        "-" +
                        firstValue.slice(selection.start + 1)
                    );
                    setSelection({
                      start: selection.start,
                      end: selection.end,
                    });
                  }
                } else if (
                  ["+", "/", "×", "%", "^"].includes(
                    firstValue[selection.start]
                  )
                ) {
                  setFirstValue(
                    firstValue.slice(0, selection.start) +
                      "-" +
                      firstValue.slice(selection.start + 1)
                  );
                } else {
                  setFirstValue(
                    firstValue.slice(0, selection.start) +
                      "-" +
                      firstValue.slice(selection.start)
                  );
                  setSelection({
                    start: selection.start + 1,
                    end: selection.end + 1,
                  });
                }
              }}
            />
          </View>
          <View style={styles.buttonRow}>
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={1}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "1" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={2}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "2" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={3}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "3" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              buttonValue="+"
              styleText={{ color: "black" }}
              style={{
                backgroundColor: isDarkMode ? "#ffffffbc" : "#686868d6",
              }}
              onPressProp={() => {
                if (!firstValue || firstValue[selection.start - 1] == "(") {
                  null;
                } else if (
                  ["+", "/", "×", "%", "^"].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start != firstValue.length
                ) {
                  setFirstValue(
                    firstValue.slice(0, selection.start - 1) +
                      "+" +
                      firstValue.slice(selection.start)
                  );
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 2]
                  )
                ) {
                  null;
                } else if (
                  ["-", "+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start - 1]
                  ) &&
                  selection.start == firstValue.length
                ) {
                  if (firstValue.slice(-2) == "(-") {
                    null;
                  } else {
                    setFirstValue(
                      firstValue.slice(0, selection.start - 1) + "+"
                    );
                  }
                } else if (
                  ["+", "/", "×", "%", "^", "."].includes(
                    firstValue[selection.start]
                  )
                ) {
                  null;
                } else if (
                  firstValue[selection.start - 1] == "-" &&
                  firstValue[selection.start] == "("
                ) {
                  null;
                } else {
                  setFirstValue(
                    firstValue.slice(0, selection.start) +
                      "+" +
                      firstValue.slice(selection.start)
                  );
                  setSelection({
                    start: selection.start + 1,
                    end: selection.end + 1,
                  });
                }
              }}
            />
          </View>
          <View style={styles.buttonRow}>
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              buttonValue={0}
              onPressProp={() => {
                setFirstValue(
                  firstValue.slice(0, selection.start) +
                    "0" +
                    firstValue.slice(selection.start)
                );
                setSelection({
                  start: selection.start + 1,
                  end: selection.end + 1,
                });
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              buttonValue="."
              styleText={{ color: isDarkMode ? "white" : "black" }}
              onPressProp={() => {
                if (!dotCanBeAdded(firstValue)) {
                  null;
                } else {
                  if (
                    ["-", "+", "×", "/", "%", "^", ")", ".", "("].includes(
                      firstValue[selection.start - 1]
                    )
                  ) {
                    null;
                  } else {
                    setFirstValue(
                      firstValue.slice(0, selection.start) +
                        "." +
                        firstValue.slice(selection.start)
                    );
                    setSelection({
                      start: selection.start + 1,
                      end: selection.end + 1,
                    });
                  }
                }
              }}
            />
            <ButtonComponent
              isDarkMode={isDarkMode}
              styleText={{ color: isDarkMode ? "white" : "black" }}
              onPressProp={() => {
                if (selection.start == 0) {
                  null;
                } else {
                  setFirstValue(
                    firstValue.slice(0, selection.start - 1) +
                      firstValue.slice(selection.start)
                  );
                  setSelection({
                    start:
                      selection.start - 1 < 0
                        ? selection.start
                        : selection.start - 1,
                    end:
                      selection.end - 1 < 0 ? selection.end : selection.end - 1,
                  });
                }
              }}
              onLongPressProp={() => {
                setFirstValue("");
                setSelection({
                  start: 0,
                  end: 0,
                });
              }}
              buttonValue={<Ionicons name="backspace-outline" size={40} />}
            />
            <ButtonComponent
              style={{
                backgroundColor: "#ce8338f6",
              }}
              styleText={{ color: "#c4a1a1" }}
              buttonValue="="
              onPressProp={() => {
                if (result != "Infinity" && typeof result !== "undefined") {
                  setFirstValue(`${+parseFloat(result)?.toFixed(5)}`);
                  setSelection({
                    start: `${+parseFloat(result)?.toFixed(5)}`.length,
                    end: `${+parseFloat(result)?.toFixed(5)}`.length,
                  });
                } else {
                  null;
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  upperContainer: {
    flex: 2,
    marginRight: 0.03 * windowHeight,
  },
  expressionContainer: {
    flex: 1.5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  numpadContainer: {
    flex: 3,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  resultStyle: {
    textAlign: "center",
    color: "white",
  },
});

export default ButtonTestNew;
