"use client";

import React, { useEffect, useState } from "react";
import { registerLicense } from "@syncfusion/ej2-base";
import {
  GanttComponent,
  Toolbar,
  Edit,
  Selection,
  Sort,
  Reorder,
  ContextMenu,
  DayMarkers,
  Inject,
  ColumnDirective,
  ColumnsDirective,
} from "@syncfusion/ej2-react-gantt";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Search";

// Syncfusion 라이선스 등록
registerLicense(
  "Ngo9BigBOggjHTQxAR8/ V1NNaF1cWWhPYVB2WmFZfVtgdVVMYV hbRH9PIiBoS35Rc0VlW3xccnVRRmlUWEF/VEBU"
);

export default function ProductionGantt() {
  const [scenario, setScenario] = useState("S0100000");
  const [operations, setOperations] = useState([]);

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/analysis/gantt?scenarioId=S000001"
        );
        const data = await res.json();

        // parentId별 그룹핑
        const groupedByParent = data.reduce((acc, item) => {
          if (!item.parentId) return acc;
          if (!acc[item.parentId]) acc[item.parentId] = [];
          acc[item.parentId].push(item);
          return acc;
        }, {});

        // 부모 작업 필터링 (parentId 없는 것)
        const parents = data.filter((item) => !item.parentId);

        const processed = [];

        parents.forEach((parent) => {
          processed.push({
            ...parent,
            id: parent.id,
            parentID: null,
            startDate: parent.startDate ? new Date(parent.startDate) : null,
            endDate: parent.endDate ? new Date(parent.endDate) : null,
            dependency: "",
          });

          const children = groupedByParent[parent.id];
          if (children) {
            // 시작일 기준 정렬
            children.sort(
              (a, b) => new Date(a.startDate) - new Date(b.startDate)
            );

            children.forEach((child, index) => {
              const dep =
                index === 0 ? `${parent.id}FS` : `${children[index - 1].id}FS`;

              processed.push({
                ...child,
                id: child.id,
                parentID: child.parentId,
                startDate: child.startDate ? new Date(child.startDate) : null,
                endDate: child.endDate ? new Date(child.endDate) : null,
                dependency: dep,
              });
            });
          }
        });

        setOperations(processed);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchOperations();
  }, []);

  const tooltipSettings = {
    showTooltip: true,
    taskbar: "Custom",
  };

  const handleTooltip = (args) => {
    console.log("??");
    const data = args.data;
    const formatDate = (date) =>
      date ? new Date(date).toLocaleString("ko-KR", { hour12: false }) : "";

    args.tooltip = `
    <div style="padding: 8px; font-size: 13px; max-width: 300px;">
      <div><strong>공정명:</strong> ${data.name}</div>
      <div><strong>공정 ID:</strong> ${data.id}</div>
      <div><strong>작업장:</strong> ${data.workCenter || "N/A"}</div>
      <div><strong>담당자:</strong> ${data.tool || "N/A"}</div>
      <div><strong>시작:</strong> ${formatDate(data.startDate)}</div>
      <div><strong>종료:</strong> ${formatDate(data.endDate)}</div>
    </div>
  `;
  };
  const tooltipTemplate = (props) => {
    // 날짜 포맷 정리
    const formatDate = (date) =>
      date ? new Date(date).toLocaleString("ko-KR", { hour12: false }) : "";

    return (
      <div style={{ padding: "8px", fontSize: "13px", maxWidth: "300px" }}>
        <div>
          <strong>공정명:</strong> {props.name}
        </div>
        <div>
          <strong>공정 ID:</strong> {props.id}
        </div>
        <div>
          <strong>작업장:</strong> {props.workCenter || "N/A"}
        </div>
        <div>
          <strong>담당자:</strong> {props.tool || "N/A"}
        </div>
        <div>
          <strong>시작:</strong> {formatDate(props.startDate)}
        </div>
        <div>
          <strong>종료:</strong> {formatDate(props.endDate)}
        </div>
      </div>
    );
  };

  const taskFields = {
    id: "id",
    name: "name",
    startDate: "startDate",
    endDate: "endDate",
    duration: "duration",
    progress: "progress",
    dependency: "dependency",
    parentID: "parentID",
  };

  const editSettings = {
    allowEditing: true,
    editMode: "Auto",
    allowTaskbarEditing: true,
  };

  const labelSettings = {
    rightLabel: "Resources",
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      {/* 필터 바 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>시나리오</InputLabel>
            <Select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              label="시나리오"
            >
              <MenuItem value="S0100000">S0100000</MenuItem>
              <MenuItem value="S0200000">S0200000</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="시작일"
            size="small"
            defaultValue="2025-03-15"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="종료일"
            size="small"
            defaultValue="2025-06-31"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="model-select-label">기종/호기</InputLabel>
            <Select
              labelId="model-select-label"
              label="기종/호기"
              defaultValue="F404"
            >
              <MenuItem value="F404">F404 [10020250]</MenuItem>
              <MenuItem value="F100">F100 [12345678]</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="화살표"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="트리 열기/닫기"
          />
          <FormControlLabel control={<Switch />} label="정렬" />
          <Button variant="outlined" startIcon={<SearchIcon />} size="small">
            검색
          </Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} size="small">
            초기화
          </Button>
          <Button variant="outlined" startIcon={<SaveIcon />} size="small">
            저장
          </Button>
        </Box>
      </Paper>

      {/* 간트 차트 */}
      <Box sx={{ width: "100%", position: "relative" }}>
        <GanttComponent
          dataSource={operations}
          taskFields={{
            id: "id",
            name: "name",
            startDate: "startDate",
            endDate: "endDate",
            parentID: "parentID",
            dependency: "dependency",
          }}
          tooltipSettings={{
            showTooltip: true,
          }}
          editSettings={editSettings}
          labelSettings={labelSettings}
          queryTaskbarInfo={handleTooltip}
          toolbar={["ExpandAll", "CollapseAll"]}
          timelineSettings={{
            timelineUnitSize: 60,
            topTier: { unit: "Day", format: "MM/dd" },
            bottomTier: { unit: "Hour", format: "HH:mm", count: 6 },
          }}
          dayWorkingTime={[{ from: 0, to: 24 }]}
          highlightWeekends
          splitterSettings={{ columnIndex: 2 }}
          height="787px"
          width="1622px"
        >
          <ColumnsDirective>
            <ColumnDirective field="id" headerText="작업공정ID" width={150} />
            <ColumnDirective field="name" headerText="작업명" width={200} />
            <ColumnDirective
              field="startDate"
              headerText="시작일"
              width={120}
              format="yyyy-MM-dd"
            />
            <ColumnDirective
              field="endDate"
              headerText="종료일"
              width={120}
              format="yyyy-MM-dd"
            />
          </ColumnsDirective>
          <Inject services={[Edit, Sort, Toolbar]} />
        </GanttComponent>
      </Box>
    </Box>
  );
}
