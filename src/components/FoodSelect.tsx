import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Image, Platform, Animated } from 'react-native';
import PixelGrid from './PixelGrid';
import { usePetStore } from '../store/petStore';
import { FOOD_OPTIONS } from '../data/foodData';
import { riceBallSprite, appleSprite, cookieSprite } from '../data/petSprites';
import { PixelFrame } from '../types';

// ── SVG assets as base64 data URIs ───────────────────────────
const ARROW_RIGHT_B64 = 'PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxMCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuMjg2MTMgMTUuNzEzOUg1LjcxMzg3VjE3LjE0MjZIOC41NzEyOVYxNS43MTM5SDUuNzE0ODRWMTQuMjg1Mkg0LjI4NjEzVjE1LjcxMzlaTTguNTcxMjkgMTUuNzEzOUgxMFYxLjQyODcxSDguNTcxMjlWMTUuNzEzOVpNMi44NTc0MiAxNC4yODUySDQuMjg2MTNWMTIuODU2NEgyLjg1NzQyVjE0LjI4NTJaTTEuNDI4NzEgMTIuODU3NEgyLjg1NzQyVjExLjQyODdIMS40Mjg3MVYxMi44NTc0Wk0wIDExLjQyODdIMS40Mjg3MVY1LjcxMzg3SDBWMTEuNDI4N1pNMS40Mjg3MSA1LjcxMzg3SDIuODU3NDJWNC4yODYxM0gxLjQyODcxVjUuNzEzODdaTTIuODU3NDIgNC4yODYxM0g0LjI4NjEzVjIuODU3NDJIMi44NTc0MlY0LjI4NjEzWk00LjI4NjEzIDIuODU3NDJINS43MTM4N1YxLjQyODcxSDQuMjg2MTNWMi44NTc0MlpNNS43MTM4NyAxLjQyODcxSDguNTcxMjlWMEg1LjcxMzg3VjEuNDI4NzFaIiBmaWxsPSIjNkQ3NDcwIi8+CjxwYXRoIGQ9Ik0xLjQyODk2IDExLjQyODdIMi44NTY2OVYxMi44NTc0SDQuMjg1NFYxNC4yODUySDUuNzE0MTFWMTUuNzEzOUg4LjU3MTUzVjEyLjg1NzRINS43MTQxMVYxMS40Mjg3SDQuMjg1NFYxMEgyLjg1NjY5VjguNTcxMjlIMS40Mjg5NlYxMS40Mjg3WiIgZmlsbD0iI0QwRDRDNyIvPgo8cGF0aCBkPSJNNS43MTQxMSAxMi44NTcySDguNTcxNTNWMTEuNDI4NUg1LjcxNDExVjEyLjg1NzJaTTQuMjg1NCAxMS40Mjg1SDUuNzE0MTFWOS45OTk3Nkg0LjI4NTRWMTEuNDI4NVpNMi44NTY2OSA5Ljk5OTc2SDQuMjg1NFY4LjU3MTA0SDIuODU2NjlWOS45OTk3NlpNMS40Mjg5NiA4LjU3MTA0SDIuODU2NjlWNS43MTQ2SDEuNDI4OTZWOC41NzEwNFpNMi44NTY2OSA1LjcxNDZINC4yODU0VjQuMjg1ODlIMi44NTY2OVY1LjcxNDZaTTQuMjg1NCA0LjI4NTg5SDUuNzE0MTFWMi44NTcxOEg0LjI4NTRWNC4yODU4OVpNNS43MTQxMSAyLjg1NzE4SDcuMTQyODJWMS40Mjg0N0g1LjcxNDExVjIuODU3MThaIiBmaWxsPSIjRDlEOUQ5Ii8+CjxwYXRoIGQ9Ik03LjE0MjgyIDIuODU3MThINS43MTQxMVY0LjI4NTg5SDQuMjg1NFY1LjcxNDZIMi44NTY2OVY4LjU3MTA0SDQuMjg1NFY5Ljk5OTc2SDUuNzE0MTFWMTEuNDI4NUg4LjU3MTUzVjEuNDI4NDdINy4xNDI4MlYyLjg1NzE4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==';

const BTN_WHITE_B64 = 'PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5LjMzMyAyMEgwLjY2Njk5MlYxOS4yNTk4SDE5LjMzM1YyMFpNMC42NjY5OTIgMTkuMjU5OEgwLjQ0NDMzNlYxOC41MTg2SDAuNjY2OTkyVjE5LjI1OThaTTE5LjU1NTcgMTkuMjU5OEgxOS4zMzRWMTguNTE4NkgxOS41NTU3VjE5LjI1OThaTTAuNDQ0MzM2IDE4LjUxODZIMC4yMjI2NTZWMTcuNzc4M0gwLjQ0NDMzNlYxOC41MTg2Wk0xOS43NzgzIDE4LjUxODZIMTkuNTU1N1YxNy43NzgzSDE5Ljc3ODNWMTguNTE4NlpNMC4yMjI2NTYgMTcuNzc3M0gwVjIuMjIyNjZIMC4yMjI2NTZWMTcuNzc3M1pNMjAgMTcuNzc3M0gxOS43NzgzVjIuMjIyNjZIMjBWMTcuNzc3M1pNMC40NDQzMzYgMi4yMjI2NkgwLjIyMjY1NlYxLjQ4MTQ1SDAuNDQ0MzM2VjIuMjIyNjZaTTE5Ljc3ODMgMi4yMjI2NkgxOS41NTU3VjEuNDgxNDVIMTkuNzc4M1YyLjIyMjY2Wk0wLjY2Njk5MiAxLjQ4MTQ1SDAuNDQ0MzM2VjAuNzQxMjExSDAuNjY2OTkyVjEuNDgxNDVaTTE5LjU1NTcgMS40ODE0NUgxOS4zMzRWMC43NDEyMTFIMTkuNTU1N1YxLjQ4MTQ1Wk0xOS4zMzMgMC43NDEyMTFIMC42NjY5OTJWMEgxOS4zMzNWMC43NDEyMTFaIiBmaWxsPSIjMDIwMTVEIi8+CjxwYXRoIGQ9Ik0wLjg4OTE2IDE3Ljc3NzhIMC42NjY1MDRWMTcuMDM3NkgwLjg4OTE2VjE3Ljc3NzhaTTE5LjMzMzUgMTcuNzc3OEgxOS4xMTE4VjE3LjAzNzZIMTkuMzMzNVYxNy43Nzc4Wk0wLjY2NjUwNCAxNy4wMzc2SDAuNDQ0ODI0VjE2LjI5NjRIMC42NjY1MDRWMTcuMDM3NlpNMTkuNTU2MiAxNy4wMzc2SDE5LjMzMzVWMTYuMjk2NEgxOS41NTYyVjE3LjAzNzZaTTAuNDQ0ODI0IDE2LjI5NjRIMC4yMjIxNjhWMTUuNTU1MkgwLjQ0NDgyNFYxNi4yOTY0Wk0xOS43Nzc4IDE2LjI5NjRIMTkuNTU2MlYxNS41NTYySDE5Ljc3NzhWMTYuMjk2NFpNMC40NDQ4MjQgMi45NjMzOEgwLjIyMjE2OFYyLjIyMjE3SDAuNDQ0ODI0VjIuOTYzMzhaTTE5Ljc3NzggMi45NjMzOEgxOS41NTYyVjIuMjIyMTdIMTkuNzc3OFYyLjk2MzM4Wk0wLjY2NjUwNCAyLjIyMjE3SDAuNDQ0ODI0VjEuNDgxOTNIMC42NjY1MDRWMi4yMjIxN1pNMTkuNTU2MiAyLjIyMjE3SDE5LjMzMzVWMS40ODE5M0gxOS41NTYyVjIuMjIyMTdaTTAuODg5MTYgMS40ODE5M0gwLjY2NjUwNFYwLjc0MDcyM0gwLjg4OTE2VjEuNDgxOTNaTTE5LjMzMzUgMS40ODE5M0gxOS4xMTE4VjAuNzQwNzIzSDE5LjMzMzVWMS40ODE5M1oiIGZpbGw9IiNEREM3RkYiLz4KPHBhdGggZD0iTTE5LjExMTEgMi45NjMzOEgxOS4zMzM3VjE1LjU1NTJIMTkuMTExMVYxNi4yOTY0SDAuODg5NDA0VjE1LjU1NTJIMC42NjY3NDhWMi45NjMzOEgwLjg0OTQwNFYyLjIyMjE3SDE5LjExMTFWMi45NjMzOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xOS4xMTA4IDIuMjIyMTdIMC44ODkxNlYyLjk2MzM4SDAuNjY2NTA0VjE1LjU1NjJIMC44ODkxNlYxNi4yOTY0SDE5LjExMDhWMTcuNzc3OEgwLjg4OTE2VjE3LjAzNzZIMC42NjY1MDRWMTYuMjk2NEgwLjQ0NDgyNFYxNS41NTUySDAuMjIyMTY4VjIuOTYzMzhIMC40NDQ4MjRWMi4yMjIxN0gwLjY2NjUwNFYxLjQ4MTkzSDAuODg5MTZWMC43NDA3MjNIMTkuMTEwOFYyLjIyMjE3Wk0xOS4zMzM1IDIuMjIyMTdIMTkuNTU2MlYyLjk2MzM4SDE5Ljc3NzhWMTUuNTU1MkgxOS41NTYyVjE2LjI5NjRIMTkuMzMzNVYxNy4wMzc2SDE5LjExMThWMTUuNTU2MkgxOS4zMzM1VjIuOTYzMzhIMTkuMTExOFYxLjQ4MTkzSDE5LjMzMzVWMi4yMjIxN1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0wLjQ0NDgyNCAxNy4wMzc2SDAuNjY2NTA0VjE3Ljc3NzhIMTkuMzMzNVYxNy4wMzc2SDE5LjU1NjJWMTYuMjk2NEgxOS43Nzc4VjE3Ljc3NzhIMTkuNTU2MlYxOC41MTlIMTkuMzMzNVYxOS4yNTkzSDAuNjY2NTA0VjE4LjUxOUgwLjQ0NDgyNFYxNy43Nzc4SDAuMjIyMTY4VjE2LjI5NjRIMC40NDQ4MjRWMTcuMDM3NloiIGZpbGw9IiM5ODdFQkYiLz4KPC9zdmc+Cg==';

const BTN_BLUE_B64 = 'PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5LjMzMyAyMEgwLjY2Njk5MlYxOS4yNTk4SDE5LjMzM1YyMFpNMC42NjY5OTIgMTkuMjU5OEgwLjQ0NDMzNlYxOC41MTg2SDAuNjY2OTkyVjE5LjI1OThaTTE5LjU1NTcgMTkuMjU5OEgxOS4zMzRWMTguNTE4NkgxOS41NTU3VjE5LjI1OThaTTAuNDQ0MzM2IDE4LjUxODZIMC4yMjI2NTZWMTcuNzc4M0gwLjQ0NDMzNlYxOC41MTg2Wk0xOS43NzgzIDE4LjUxODZIMTkuNTU1N1YxNy43NzgzSDE5Ljc3ODNWMTguNTE4NlpNMC4yMjI2NTYgMTcuNzc3M0gwVjIuMjIyNjZIMC4yMjI2NTZWMTcuNzc3M1pNMjAgMTcuNzc3M0gxOS43NzgzVjIuMjIyNjZIMjBWMTcuNzc3M1pNMC40NDQzMzYgMi4yMjI2NkgwLjIyMjY1NlYxLjQ4MTQ1SDAuNDQ0MzM2VjIuMjIyNjZaTTE5Ljc3ODMgMi4yMjI2NkgxOS41NTU3VjEuNDgxNDVIMTkuNzc4M1YyLjIyMjY2Wk0wLjY2Njk5MiAxLjQ4MTQ1SDAuNDQ0MzM2VjAuNzQxMjExSDAuNjY2OTkyVjEuNDgxNDVaTTE5LjU1NTcgMS40ODE0NUgxOS4zMzRWMC43NDEyMTFIMTkuNTU1N1YxLjQ4MTQ1Wk0xOS4zMzMgMC43NDEyMTFIMC42NjY5OTJWMEgxOS4zMzNWMC43NDEyMTFaIiBmaWxsPSIjMDIwMTVEIi8+CjxwYXRoIGQ9Ik0wLjg4OTE2IDE3Ljc3NzhIMC42NjY1MDRWMTcuMDM3NkgwLjg4OTE2VjE3Ljc3NzhaTTE5LjMzMzUgMTcuNzc3OEgxOS4xMTE4VjE3LjAzNzZIMTkuMzMzNVYxNy43Nzc4Wk0wLjY2NjUwNCAxNy4wMzc2SDAuNDQ0ODI0VjE2LjI5NjRIMC42NjY1MDRWMTcuMDM3NlpNMTkuNTU2MiAxNy4wMzc2SDE5LjMzMzVWMTYuMjk2NEgxOS41NTYyVjE3LjAzNzZaTTAuNDQ0ODI0IDE2LjI5NjRIMC4yMjIxNjhWMTUuNTU1MkgwLjQ0NDgyNFYxNi4yOTY0Wk0xOS43Nzc4IDE2LjI5NjRIMTkuNTU2MlYxNS41NTYySDE5Ljc3NzhWMTYuMjk2NFpNMC40NDQ4MjQgMi45NjMzOEgwLjIyMjE2OFYyLjIyMjE3SDAuNDQ0ODI0VjIuOTYzMzhaTTE5Ljc3NzggMi45NjMzOEgxOS41NTYyVjIuMjIyMTdIMTkuNzc3OFYyLjk2MzM4Wk0wLjY2NjUwNCAyLjIyMjE3SDAuNDQ0ODI0VjEuNDgxOTNIMC42NjY1MDRWMi4yMjIxN1pNMTkuNTU2MiAyLjIyMjE3SDE5LjMzMzVWMS40ODE5M0gxOS41NTYyVjIuMjIyMTdaTTAuODg5MTYgMS40ODE5M0gwLjY2NjUwNFYwLjc0MDcyM0gwLjg4OTE2VjEuNDgxOTNaTTE5LjMzMzUgMS40ODE5M0gxOS4xMTE4VjAuNzQwNzIzSDE5LjMzMzVWMS40ODE5M1oiIGZpbGw9IiMyQzJDRTEiLz4KPHBhdGggZD0iTTE5LjExMTEgMi45NjMzOEgxOS4zMzM3VjE1LjU1NTJIMTkuMTExMVYxNi4yOTY0SDAuODg5NDA0VjE1LjU1NTJIMC42NjY3NDhWMi45NjMzOEgwLjg0OTQwNFYyLjIyMjE3SDE5LjExMTFWMi45NjMzOFoiIGZpbGw9IiMwRDEyQkMiLz4KPHBhdGggZD0iTTE5LjExMDggMi4yMjIxN0gwLjg4OTE2VjIuOTYzMzhIMC42NjY1MDRWMTUuNTU2MkgwLjg4OTE2VjE2LjI5NjRIMTkuMTEwOFYxNy43Nzc4SDAuODg5MTZWMTcuMDM3NkgwLjY2NjUwNFYxNi4yOTY0SDAuNDQ0ODI0VjE1LjU1NTJIMC4yMjIxNjhWMi45NjMzOEgwLjQ0NDgyNFYyLjIyMjE3SDAuNjY2NTA0VjEuNDgxOTNIMC44ODkxNlYwLjc0MDcyM0gxOS4xMTA4VjIuMjIyMTdaTTE5LjMzMzUgMi4yMjIxN0gxOS41NTYyVjIuOTYzMzhIMTkuNzc3OFYxNS41NTUySDE5LjU1NjJWMTYuMjk2NEgxOS4zMzM1VjE3LjAzNzZIMTkuMTExOFYxNS41NTYySDE5LjMzMzVWMi45NjMzOEgxOS4xMTE4VjEuNDgxOTNIMTkuMzMzNVYyLjIyMjE3WiIgZmlsbD0iIzBEMTJCQyIvPgo8cGF0aCBkPSJNMC40NDQ4MjQgMTcuMDM3NkgwLjY2NjUwNFYxNy43Nzc4SDE5LjMzMzVWMTcuMDM3NkgxOS41NTYyVjE2LjI5NjRIMTkuNzc3OFYxNy43Nzc4SDE5LjU1NjJWMTguNTE5SDE5LjMzMzVWMTkuMjU5M0gwLjY2NjUwNFYxOC41MTlIMC40NDQ4MjRWMTcuNzc4SDAuMjIyMTY4VjE2LjI5NjRIMC40NDQ4MjRWMTcuMDM3NloiIGZpbGw9IiMyQzJDRTEiLz4KPC9zdmc+Cg==';

const BACK_ARROW_B64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIHZpZXdCb3g9IjAgMCA5IDkiIGZpbGw9Im5vbmUiPgogPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzIwNTdfNTE2MykiPgogPHBhdGggZD0iTTAuMzc1IDQuODc1VjQuMTI1SDAuNzVWMy43NUgxLjEyNVYzLjM3NUgxLjVWM0gxLjg3NVYyLjYyNUgyLjI1VjIuMjVIMi42MjVWMS44NzVIM1YxLjVIMy4zNzVWMS4xMjVIMy43NVYwLjc1SDQuMTI1VjAuMzc1SDQuNVYwLjc1SDQuODc1VjEuMTI1SDUuMjVWMS41SDQuODc1VjEuODc1SDQuNVYyLjI1SDQuMTI1VjIuNjI1SDMuNzVWM0gzLjM3NVYzLjM3NUgzVjMuNzVIOC42MjVWNS4yNUgzVjUuNjI1SDMuMzc1VjZIMy43NVY2LjM3NUg0LjEyNVY2Ljc1SDQuNVY3LjEyNUg0Ljg3NVY3LjVINS4yNVY3Ljg3NUg0Ljg3NVY4LjI1SDQuNVY4LjYyNUg0LjEyNVY4LjI1SDMuNzVWNy44NzVIMy4zNzVWNy41SDNWNy4xMjVIMi42MjVWNi43NUgyLjI1VjYuMzc1SDEuODc1VjZIMS41VjUuNjI1SDEuMTI1VjUuMjVIMC43NVY0Ljg3NUgwLjM3NVoiIGZpbGw9IndoaXRlIi8+CiA8L2c+CiA8ZGVmcz4KIDxjbGlwUGF0aCBpZD0iY2xpcDBfMjA1N181MTYzIj4KIDxyZWN0IHdpZHRoPSI5IiBoZWlnaHQ9IjkiIGZpbGw9IndoaXRlIi8+CiA8L2NsaXBQYXRoPgogPC9kZWZzPgo8L3N2Zz4K';

const LIST_VIEW_B64 = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgdmlld0JveD0iMCAwIDEwIDEwIiBmaWxsPSJub25lIj4KIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8yMDYxXzY0MjcpIj4KIDxwYXRoIGQ9Ik0wLjgyOTEwMiAyLjA3M0gyLjA3Mjg5VjMuMzE2NzlIMC44MjkxMDJWMi4wNzNaTTAuODI5MTAyIDcuMDQ4MTVIMi4wNzI4OVY4LjI5MTkzSDAuODI5MTAyVjcuMDQ4MTVaTTAuODI5MTAyIDQuNTYwNTdIMi4wNzI4OVY1LjgwNDM2SDAuODI5MTAyVjQuNTYwNTdaTTkuNTM1NjEgMi40ODc1OVYyLjkwMjE5SDkuMTIxMDJWMy4zMTY3OUg0LjE0NTg3VjIuOTAyMTlIMy43MzEyN1YyLjQ4NzU5SDQuMTQ1ODdWMi4wNzNIOS4xMjEwMlYyLjQ4NzU5SDkuNTM1NjFaTTkuMTIxMDIgNC45NzUxN0g5LjUzNTYxVjUuMzg5NzZIOS4xMjEwMlY1LjgwNDM2SDQuMTQ1ODdWNS4zODk3NkgzLjczMTI3VjQuOTc1MTdINC4xNDU4N1Y0LjU2MDU3SDkuMTIxMDJWNC45NzUxN1pNOS4xMjEwMiA3LjQ2Mjc0SDkuNTM1NjFWNy44NzczNEg5LjEyMTAyVjguMjkxOTNINC4xNDU4N1Y3Ljg3NzM0SDMuNzMxMjdWNy40NjI3NEg0LjE0NTg3VjcuMDQ4MTVIOS4xMjEwMlY3LjQ2Mjc0WiIgZmlsbD0iIzAyMDE1RCIvPgogPC9nPgogPGRlZnM+CiA8Y2xpcFBhdGggaWQ9ImNsaXAwXzIwNjFfNjQyNyI+CiA8cmVjdCB3aWR0aD0iOS45NTAzIiBoZWlnaHQ9IjkuOTUwMyIgZmlsbD0id2hpdGUiLz4KIDwvY2xpcFBhdGg+CiA8L2RlZnM+Cjwvc3ZnPgo=';

const milkImg = require('../assets/ui/food-select/milk.png');
const INFINITY_B64 = 'PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE5IDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KICA8IS0tIFRoaWNrZXIgcGl4ZWxhdGVkIGluZmluaXR5LCAzcHggc3Ryb2tlIHdlaWdodCAtLT4KICA8IS0tIExlZnQgbG9vcCB0b3AgLS0+CiAgPHJlY3QgeD0iMiIgeT0iMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAyMDE1RCIvPgogIDwhLS0gTGVmdCBsb29wIGxlZnQgc2lkZSAtLT4KICA8cmVjdCB4PSIwIiB5PSIyIiB3aWR0aD0iMiIgaGVpZ2h0PSI1IiBmaWxsPSIjMDIwMTVEIi8+CiAgPCEtLSBMZWZ0IGxvb3AgYm90dG9tIC0tPgogIDxyZWN0IHg9IjIiIHk9IjciIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMjAxNUQiLz4KICA8IS0tIExlZnQgbG9vcCByaWdodCArIGNyb3NzIC0tPgogIDxyZWN0IHg9IjYiIHk9IjEiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIGZpbGw9IiMwMjAxNUQiLz4KICA8cmVjdCB4PSI2IiB5PSI1IiB3aWR0aD0iMiIgaGVpZ2h0PSIzIiBmaWxsPSIjMDIwMTVEIi8+CiAgPCEtLSBDZW50ZXIgY3Jvc3MgLS0+CiAgPHJlY3QgeD0iOCIgeT0iMyIgd2lkdGg9IjMiIGhlaWdodD0iMyIgZmlsbD0iIzAyMDE1RCIvPgogIDwhLS0gUmlnaHQgbG9vcCBsZWZ0ICsgY3Jvc3MgLS0+CiAgPHJlY3QgeD0iMTEiIHk9IjEiIHdpZHRoPSIyIiBoZWlnaHQ9IjMiIGZpbGw9IiMwMjAxNUQiLz4KICA8cmVjdCB4PSIxMSIgeT0iNSIgd2lkdGg9IjIiIGhlaWdodD0iMyIgZmlsbD0iIzAyMDE1RCIvPgogIDwhLS0gUmlnaHQgbG9vcCB0b3AgLS0+CiAgPHJlY3QgeD0iMTMiIHk9IjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMjAxNUQiLz4KICA8IS0tIFJpZ2h0IGxvb3AgcmlnaHQgc2lkZSAtLT4KICA8cmVjdCB4PSIxNyIgeT0iMiIgd2lkdGg9IjIiIGhlaWdodD0iNSIgZmlsbD0iIzAyMDE1RCIvPgogIDwhLS0gUmlnaHQgbG9vcCBib3R0b20gLS0+CiAgPHJlY3QgeD0iMTMiIHk9IjciIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMjAxNUQiLz4KPC9zdmc+Cg==';
const infinitySrc = { uri: `data:image/svg+xml;base64,${INFINITY_B64}` };

const navArrowSrc = { uri: `data:image/svg+xml;base64,${ARROW_RIGHT_B64}` };
const btnWhiteSrc = { uri: `data:image/svg+xml;base64,${BTN_WHITE_B64}` };
const btnBlueSrc = { uri: `data:image/svg+xml;base64,${BTN_BLUE_B64}` };
const backArrowSrc = { uri: `data:image/svg+xml;base64,${BACK_ARROW_B64}` };
const listViewSrc = { uri: `data:image/svg+xml;base64,${LIST_VIEW_B64}` };

// ── Food sprite map (PixelGrid for non-milk items) ───────────
const FOOD_SPRITES: Record<string, PixelFrame> = {
  riceball: riceBallSprite,
  apple: appleSprite,
  cookie: cookieSprite,
};

// ── Animated bouncing arrow ──────────────────────────────────
const BouncingArrow: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => {
  const bounce = useRef(new Animated.Value(0)).current;
  const pixelated = Platform.OS === 'web' ? ({ imageRendering: 'pixelated' } as any) : {};

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: direction === 'left' ? -3 : 3, duration: 500, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [bounce, direction]);

  return (
    <Animated.View style={{ transform: [{ translateX: bounce }] }}>
      <Image
        source={navArrowSrc}
        style={[
          { width: 14, height: 24 },
          pixelated,
          direction === 'right' ? { transform: [{ scaleX: -1 }] } : {},
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

// ── Component ────────────────────────────────────────────────
interface FoodSelectProps {
  onSelect?: () => void;
  onBack?: () => void;
}

const FoodSelect: React.FC<FoodSelectProps> = ({ onSelect, onBack }) => {
  const foodIndex = usePetStore(s => s.foodIndex);
  const setFoodIndex = usePetStore(s => s.setFoodIndex);
  const food = FOOD_OPTIONS[foodIndex];

  const goLeft = useCallback(() => {
    setFoodIndex((foodIndex - 1 + FOOD_OPTIONS.length) % FOOD_OPTIONS.length);
  }, [foodIndex, setFoodIndex]);

  const goRight = useCallback(() => {
    setFoodIndex((foodIndex + 1) % FOOD_OPTIONS.length);
  }, [foodIndex, setFoodIndex]);

  const pixelated = Platform.OS === 'web' ? ({ imageRendering: 'pixelated' } as any) : {};

  // Render food image — milk uses the Figma PNG, others use PixelGrid
  const renderFoodImage = () => {
    if (food.id === 'milk') {
      return <Image source={milkImg} style={[styles.foodImage, pixelated]} resizeMode="contain" />;
    }
    const sprite = FOOD_SPRITES[food.id];
    if (sprite) {
      return <PixelGrid data={sprite} pixelSize={6} />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* ── Top bar: back (LEFT/blue) + list (RIGHT/white) ── */}
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.topBtn}>
          <Image source={btnBlueSrc} style={[styles.btnFrame, pixelated]} resizeMode="contain" />
          <Image source={backArrowSrc} style={[styles.topBtnIcon, pixelated]} resizeMode="contain" />
        </Pressable>

        <Pressable style={styles.topBtn}>
          <Image source={btnWhiteSrc} style={[styles.btnFrame, pixelated]} resizeMode="contain" />
          <Image source={listViewSrc} style={[styles.topBtnIcon, pixelated]} resizeMode="contain" />
        </Pressable>
      </View>

      {/* ── Center: arrows + food display (no border, full width) ── */}
      <View style={styles.centerRow}>
        <Pressable onPress={goLeft} style={styles.arrowHit}>
          <BouncingArrow direction="left" />
        </Pressable>

        <Pressable onPress={onSelect} style={styles.foodCard}>
          {renderFoodImage()}
        </Pressable>

        <Pressable onPress={goRight} style={styles.arrowHit}>
          <BouncingArrow direction="right" />
        </Pressable>
      </View>

      {/* ── Name bar — wrapper with top/bottom border, inner blue bar ── */}
      <View style={styles.nameBarOuter}>
        <View style={styles.nameBarInner}>
          <Text style={styles.nameText}>{food.name.toUpperCase()}</Text>
        </View>
      </View>

      {/* ── Bottom inventory — pill showing quantity ── */}
      <View style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>
          <View style={styles.inventoryRow}>
            <Text style={styles.countX}>x</Text>
            {food.quantity === -1 ? (
              <Image source={infinitySrc} style={[styles.infinityIcon, pixelated]} resizeMode="contain" />
            ) : (
              <Text style={styles.countX}>{food.quantity}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#D8D0E8',
    flexDirection: 'column',
    gap: 8,
  },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  topBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFrame: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  topBtnIcon: {
    width: 16,
    height: 16,
  },

  // ── Center row — food display takes up ~40% height ──
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '38%' as any,
    paddingHorizontal: 8,
  },
  arrowHit: {
    width: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodCard: {
    width: '60%' as any,
    height: '100%' as any,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#02015D',
    alignItems: 'center',
    justifyContent: 'center',
    // Box shadow: 2px 3px 0 0 #02015D
    ...(Platform.OS === 'web' ? { boxShadow: '2px 3px 0 0 #02015D' } as any : {
      shadowColor: '#02015D',
      shadowOffset: { width: 2, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    }),
  },
  foodImage: {
    width: 48,
    height: 72,
  },

  // ── Name bar — outer has top/bottom border, inner is blue ──
  nameBarOuter: {
    alignSelf: 'stretch',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#02015D',
    paddingVertical: 3,
  },
  nameBarInner: {
    width: '100%' as any,
    height: 30,
    backgroundColor: '#0D12BC',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'VCROSDMono',
    textTransform: 'uppercase' as any,
    textAlign: 'center',
  },

  // ── Bottom inventory bar ──
  bottomBarWrapper: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomBar: {
    width: '100%' as any,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inventoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  infinityIcon: {
    width: 26,
    height: 14,
  },
  countX: {
    color: '#02015D',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'VCROSDMono',
    marginTop: -2,
  },
});

export default FoodSelect;
