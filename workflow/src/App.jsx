import { useState, useCallback, useEffect } from 'react';
import {
  Background,
  Panel,
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import MainWorkflow from './component/MainWorkflow';
import useSocket from './hooks/ConnectSocket';
import useTabs from './hooks/Tabs';


function App() {

  const { tabsRef, tabs, createTab, activeTab, updateActiveTab, startState, completeState, errorState } = useTabs();
  const { state, logs } = useSocket(startState, (id, state) => {
    completeState(id, state);
    console.log("complete state is as follows ----");
    console.log(state);
    try {
      if (state == "social-complete") {


        console.log("debugging--------------------------------");

        console.log("tabsref is s");
        console.log(tabsRef.current);
        console.log(id);
        console.log(tabsRef.current[id]);
        const data = JSON.parse(JSON.stringify(tabsRef.current[id]));
        console.log("data is ");
        console.log(data);
        if (data == undefined) {
          console.error("error in setting the data");
          return;
        }
        data.map.find(edge => (edge.id == state)).status = "completed";
        fetch("/save", {
          method: "POST",
          body: JSON.stringify({
            tab: data,
            logs: logs
          })
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, errorState);


  useEffect(() => {
    createTab();
  }, []);

  useEffect(() => {
    console.log("tabs changes");
    console.log(tabs)
  }, [tabs]);





  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        background: '#f5f7fb',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: '150px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 20px rgba(0,0,0,0.03)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '24px',
            fontSize: '16px',
            fontWeight: '700',
            borderBottom: '1px solid #eef2f7',
            color: '#111827',
          }}
        >
          WorkflowOS
        </div>

        {/* Active Workflow */}
        <div
          style={{
            padding: '10px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              color: '#94a3b8',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Active Workflow
          </div>

          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '10px',
              // borderRadius: '14px',
              color: '#1e3a8a',
              fontWeight: '510',
              fontSize: "12px"
            }}
          >
            {activeTab?.name}
          </div>
        </div>

        {/* Workflows */}
        <div
          style={{
            padding: '0 20px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              color: '#94a3b8',
              marginBottom: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Workflows
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* {tabs} */}
            {/* {JSON.stringify(tabs)} */}
            {/* {tabs && tabs.map(val=>val.id)} */}

            {Object.values(tabs).map((tab) => (
              <div
                key={tab.id}
                onClick={() => updateActiveTab(tab.id)}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  transition: '0.2s',
                  background:
                    activeTab?.id === tab.id
                      ? '#94a3b8'
                      : '#f8fafc',
                  color:
                    activeTab?.id === tab.id
                      ? '#ffffff'
                      : '#334155',
                  fontWeight: '500',
                  fontSize: '12px',
                }}
              >
                {tab.name || `Workflow ${tab.id}`}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            marginTop: 'auto',
            padding: '20px',
            color: '#94a3b8',
            fontSize: '10px',
          }}
        >
          React Flow Workflow Editor
        </div>
      </div>

      {/* MAIN SECTION */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* TOP NAVBAR */}
        <div
          style={{
            height: '30px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          {/* Web Pages */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
            }}
          >
            <div
              key={"status"}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#475569',
                fontWeight: '500',
              }}
            >
              <div>
                {state ? "live" : "not connected"}
              </div>
            </div>
            {['Dashboard', 'Workflows', 'Analytics', 'Settings'].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: '#475569',
                    fontWeight: '500',
                  }}
                >
                  {item}
                </div>
              )
            )}

            <button
              title="Start workflow"
              onClick={() => {
                const id = createTab();
                fetch("/start", {
                  method: "POST",
                  body: JSON.stringify({
                    id: id
                  })
                })
              }}
              style={{
                height: '32px',
                padding: '0 14px',
                marginLeft: '8px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                background: '#111827',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.1px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1f2937';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#111827';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08)';
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22c55e',
                }}
              />
              Start
            </button>

          </div>

          <div>
            {activeTab?.id}
          </div>

          {/* User */}

        </div>

        {/* TABS */}

        <MainWorkflow id={activeTab?.id} map={activeTab?.map} edges={activeTab?.edges} logs={logs} />

        {/* FLOW AREA */}

      </div>
    </div>
  );
}

export default App;