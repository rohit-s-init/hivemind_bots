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

  const { tabs, createTab, activeTab, updateActiveTab, startState, completeState, errorState } = useTabs();
  const { state, logs } = useSocket(startState, completeState, errorState);


  useEffect(() => {
    createTab();
  }, []);

  useEffect(()=>{
    console.log("tabs changes");
    console.log(tabs)
  },[tabs]);




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
            {/* {tabs.find((t) => t.id === activeTab)?.name} */}
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
            {/* {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px',
                  // borderRadius: '12px',
                  cursor: 'pointer',
                  transition: '0.2s',
                  background:
                    activeTab === tab.id
                      ? '#94a3b8'
                      : '#f8fafc',
                  color:
                    activeTab === tab.id
                      ? '#ffffff'
                      : '#334155',
                  fontWeight: '500',
                  fontSize: "12px"
                }}
              >
                {tab.name}
              </div>
            ))} */}
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
          </div>

          {/* User */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#111827',
            }}
          />
        </div>

        {/* TABS */}

        <MainWorkflow id={activeTab?.id} map={activeTab?.map} edges={activeTab?.edges} logs={logs} />

        {/* FLOW AREA */}

      </div>
    </div>
  );
}

export default App;