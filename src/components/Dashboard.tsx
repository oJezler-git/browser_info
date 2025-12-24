import React from "react";
import type { VisitorInfo } from "../types";
import "./Dashboard.css";

interface DashboardProps {
  visitor: VisitorInfo | null;
  loading?: boolean;
}

const GlitchHeader = ({ text }: { text: string }) => {
  return (
    <div className="glitch-header-container">
      <h1 className="glitch-text" data-text={text}>
        {text}
      </h1>
    </div>
  );
};

interface DataCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string; // Allow custom classes like 'wide'
}

const DataCard = ({
  title,
  icon,
  children,
  delay = 0,
  className = "",
}: DataCardProps) => {
  return (
    <div
      className={`data-card ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-header">
        {icon && <span className="card-icon">{icon}</span>}
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content">{children}</div>
      <div className="card-decoration top-right"></div>
      <div className="card-decoration bottom-left"></div>
    </div>
  );
};

const DataRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: any;
  highlight?: boolean;
}) => (
  <div className={`data-row ${highlight ? "highlight" : ""}`}>
    <span className="data-label">{label}</span>
    <span className="data-value">{value || "N/A"}</span>
  </div>
);

export const Dashboard = ({ visitor, loading }: DashboardProps) => {
  if (loading || !visitor) {
    return (
      <div className="dashboard-loading">
        <GlitchHeader text="INITIALIZING..." />
        <div className="loader-bar"></div>
      </div>
    );
  }

  const { client, server } = visitor;

  return (
    <div className="dashboard-container">
      <div className="grid-layout">
        {/* Core Identity - High Priority */}
        <DataCard title="IDENTITY_CORE" icon="ID" delay={100} className="wide">
          <div className="card-grid-2">
            <DataRow
              label="FINGERPRINT ID"
              value={client?.fingerprintId}
              highlight
            />
            <DataRow
              label="CROSS-BROWSER ID"
              value={client?.crossBrowserId}
              highlight
            />
            <DataRow
              label="CONFIDENCE"
              value={client ? `${client.fingerprintConfidence}%` : "N/A"}
            />
            <DataRow label="PLATFORM" value={client?.platform} />
          </div>
        </DataCard>

        {/* Geospatial Data */}
        <DataCard title="GEOSPATIAL_ULINKS" icon="LOC" delay={200}>
          <DataRow label="IP ADDRESS" value={server.ip} highlight />
          <DataRow label="CITY" value={server.geo?.city} />
          <DataRow label="REGION" value={server.geo?.region} />
          <DataRow label="COUNTRY" value={server.geo?.country} />
          <DataRow
            label="COORDINATES"
            value={
              server.geo
                ? `${server.geo.lat.toFixed(2)}, ${server.geo.lng.toFixed(2)}`
                : null
            }
          />
          <DataRow label="ISP" value={server.geo?.isp} />
        </DataCard>

        {/* Device Hardware */}
        <DataCard title="HARDWARE_SPECS" icon="HW" delay={300}>
          <DataRow label="GPU RENDERER" value={client?.webglRenderer} />
          <DataRow label="CPU CORES" value={client?.hardwareConcurrency} />
          <DataRow
            label="RAM"
            value={client?.deviceMemory ? `~${client.deviceMemory} GB` : "N/A"}
          />
          <DataRow
            label="SCREEN"
            value={
              client ? `${client.screenWidth}x${client.screenHeight}` : "N/A"
            }
          />
          <DataRow
            label="BATTERY"
            value={client?.batteryLevel ? `${client.batteryLevel}%` : "N/A"}
          />
        </DataCard>

        {/* Psychographic Profile (AI) */}
        {client?.userProfile && (
          <DataCard
            title="PSYCHOGRAPHIC_INFERENCE"
            icon="AI"
            delay={400}
            className="tall"
          >
            <div className="ai-badge">AI ANALYSIS</div>
            <DataRow label="LIKELY AGE" value={client.userProfile.ageRange} />
            <DataRow
              label="INCOME TIER"
              value={client.userProfile.incomeLevel}
            />
            <DataRow
              label="EDUCATION"
              value={client.userProfile.educationLevel}
            />

            <div className="separator"></div>

            <DataRow
              label="RELATIONSHIP"
              value={client.userProfile.relationshipStatus}
            />
            <DataRow
              label="HOMEOWNER"
              value={client.userProfile.homeowner ? "LIKELY" : "UNLIKELY"}
            />

            <div className="tag-cloud">
              {client.userProfile.inferredInterests?.slice(0, 5).map((i) => (
                <span key={i} className="tag">
                  {i.toUpperCase()}
                </span>
              ))}
            </div>
          </DataCard>
        )}

        {/* Browser Fingerprinting */}
        <DataCard title="BROWSER_SIGNATURE" icon="FP" delay={500}>
          <DataRow
            label="USER AGENT"
            value={server.userAgent.substring(0, 30) + "..."}
          />
          <DataRow
            label="CANVAS HASH"
            value={client?.canvasFingerprint?.substring(0, 16) + "..."}
          />
          <DataRow label="AUDIO HASH" value={client?.audioFingerprint} />
          <DataRow
            label="WEBGL HASH"
            value={client?.webglFingerprint?.substring(0, 16) + "..."}
          />
        </DataCard>

        {/* Network & Connection */}
        <DataCard title="NETWORK_VECTORS" icon="NET" delay={600}>
          <DataRow label="CONNECTION TYPE" value={client?.connectionType} />
          <DataRow
            label="DOWNLINK"
            value={client?.connectionDownlink + " Mbps"}
          />
          <DataRow label="RTT" value={client?.connectionRtt + " ms"} />
          <DataRow
            label="WEBRTC LEAK"
            value={client?.webrtcLocalIPs?.length ? "DETECTED" : "SECURE"}
            highlight={!!client?.webrtcLocalIPs?.length}
          />
        </DataCard>
      </div>

      {/* SECONDARY GRID - Detailed Technical Data */}
      <h2 className="section-title">SYSTEM ANALYSIS</h2>
      <div className="grid-layout secondary-grid">
        {/* Media & Sensors */}
        <DataCard title="MEDIA_AND_SENSORS" icon="SENS" delay={700}>
          <DataRow
            label="MICROPHONES"
            value={client?.mediaDevices?.audioinput}
          />
          <DataRow label="CAMERAS" value={client?.mediaDevices?.videoinput} />
          <DataRow label="SPEAKERS" value={client?.mediaDevices?.audiooutput} />
          <div className="separator"></div>
          <DataRow
            label="ACCELEROMETER"
            value={client?.sensors?.accelerometer ? "YES" : "NO"}
          />
          <DataRow
            label="GYROSCOPE"
            value={client?.sensors?.gyroscope ? "YES" : "NO"}
          />
          <DataRow
            label="BATTERY"
            value={client?.batteryLevel ? `${client.batteryLevel}%` : "N/A"}
          />
          <DataRow
            label="CHARGING"
            value={client?.batteryCharging ? "YES" : "NO"}
          />
        </DataCard>

        {/* Advanced Fingerprinting */}
        <DataCard title="ADVANCED_FINGERPRINTING" icon="FP+" delay={800}>
          <DataRow
            label="MATH HASH"
            value={client?.mathFingerprint?.substring(0, 12) + "..."}
          />
          <DataRow
            label="TIMING HASH"
            value={client?.timingFingerprint?.substring(0, 12) + "..."}
          />
          <DataRow
            label="NAVIGATOR PROPS"
            value={client?.navigatorPropsCount}
          />
          <DataRow label="WINDOW PROPS" value={client?.windowPropsCount} />
          <DataRow
            label="FONTS DETECTED"
            value={client?.fontsDetected?.length}
          />
          <DataRow
            label="VOICES HASH"
            value={client?.speechVoicesHash?.substring(0, 12) + "..."}
          />
        </DataCard>

        {/* Web Capabilities */}
        <DataCard title="WEB_CAPABILITIES" icon="API" delay={900}>
          <DataRow
            label="SERVICE WORKER"
            value={client?.serviceWorkerSupported ? "YES" : "NO"}
          />
          <DataRow
            label="WEB WORKER"
            value={client?.webWorkerSupported ? "YES" : "NO"}
          />
          <DataRow
            label="WEBSOCKET"
            value={client?.webSocketSupported ? "YES" : "NO"}
          />
          <DataRow
            label="WEBRTC"
            value={client?.webRTCSupported ? "YES" : "NO"}
          />
          <DataRow
            label="GAMEPADS"
            value={client?.gamepadsSupported ? "YES" : "NO"}
          />
          <DataRow
            label="BLUETOOTH"
            value={client?.bluetoothSupported ? "YES" : "NO"}
          />
        </DataCard>

        {/* Storage & Codecs */}
        <DataCard title="STORAGE_AND_CODECS" icon="DSK" delay={1000}>
          <DataRow
            label="STORAGE QUOTA"
            value={
              client?.storageQuota?.quota
                ? `${(client.storageQuota.quota / 1024 / 1024 / 1024).toFixed(
                    1
                  )} GB`
                : "N/A"
            }
          />
          <DataRow
            label="STORAGE USED"
            value={client?.storageQuota?.usage + " B"}
          />
          <div className="separator"></div>
          <DataRow
            label="COOKIES"
            value={client?.cookiesEnabled ? "YES" : "NO"}
          />
          <DataRow
            label="LOCAL STORAGE"
            value={client?.localStorageEnabled ? "YES" : "NO"}
          />
        </DataCard>

        {/* System Preferences */}
        <DataCard title="SYSTEM_PREFS" icon="CFG" delay={1100}>
          <DataRow label="COLOR SCHEME" value={client?.prefersColorScheme} />
          <DataRow label="CONTRAST" value={client?.prefersContrast} />
          <DataRow
            label="REDUCED MOTION"
            value={client?.prefersReducedMotion ? "YES" : "NO"}
          />
          <DataRow
            label="HDR SUPPORT"
            value={client?.hdrSupported ? "YES" : "NO"}
          />
          <DataRow
            label="HARDWARE FAMILY"
            value={client?.hardwareFamily || "Unknown"}
          />
        </DataCard>

        {/* Security & Risk */}
        <DataCard title="SECURITY_VECTORS" icon="SEC" delay={1200}>
          <DataRow
            label="AD BLOCKER"
            value={client?.adBlockerDetected ? "DETECTED" : "NO"}
            highlight={!!client?.adBlockerDetected}
          />
          <DataRow
            label="INCOGNITO"
            value={client?.isIncognito ? "YES" : "NO"}
            highlight={!!client?.isIncognito}
          />
          <DataRow
            label="VIRTUAL MACHINE"
            value={client?.isVirtualMachine ? "YES" : "NO"}
            highlight={!!client?.isVirtualMachine}
          />
          <DataRow
            label="VPN DETECTED"
            value={client?.vpnDetection?.likelyUsingVPN ? "YES" : "NO"}
            highlight={!!client?.vpnDetection?.likelyUsingVPN}
          />
          <DataRow
            label="TOR BROWSER"
            value={
              client?.userProfile?.privacyConscious ? "POSSIBLE" : "UNLIKELY"
            }
          />
        </DataCard>
      </div>

      {/* BEHAVIORAL ANALYSIS */}
      <h2 className="section-title">BEHAVIORAL BIOMETRICS</h2>
      <div className="grid-layout secondary-grid">
        {/* Live Behavior */}
        <DataCard title="MOUSE_DYNAMICS" icon="MSE" delay={1300}>
          <DataRow
            label="SPEED"
            value={
              client?.behavior?.mouseSpeed
                ? `${client.behavior.mouseSpeed.toFixed(0)} px/s`
                : "0 px/s"
            }
          />
          <DataRow
            label="ACCELERATION"
            value={client?.behavior?.mouseAcceleration?.toFixed(0)}
          />
          <DataRow label="MOVEMENTS" value={client?.behavior?.mouseMovements} />
          <DataRow
            label="DISTANCE"
            value={client?.behavior?.mouseDistanceTraveled + " px"}
          />
          <DataRow
            label="HANDEDNESS"
            value={client?.advancedBehavior?.likelyHandedness}
          />
        </DataCard>

        <DataCard title="INTERACTION_METRICS" icon="INT" delay={1400}>
          <DataRow label="CLICKS" value={client?.behavior?.clickCount} />
          <DataRow
            label="SCROLL DEPTH"
            value={client?.behavior?.scrollDepthMax + "%"}
          />
          <DataRow
            label="TYPING SPEED"
            value={client?.behavior?.typingSpeed + " CPM"}
          />
          <DataRow
            label="FOCUS TIME"
            value={(client?.behavior?.totalFocusTime || 0) + " ms"}
          />
        </DataCard>

        <DataCard title="SOCIAL_GRAPHS" icon="SOC" delay={1500}>
          <DataRow
            label="GOOGLE"
            value={client?.socialLogins?.google ? "LOGGED IN" : "-"}
            highlight={!!client?.socialLogins?.google}
          />
          <DataRow
            label="FACEBOOK"
            value={client?.socialLogins?.facebook ? "LOGGED IN" : "-"}
            highlight={!!client?.socialLogins?.facebook}
          />
          <DataRow
            label="TWITTER"
            value={client?.socialLogins?.twitter ? "LOGGED IN" : "-"}
            highlight={!!client?.socialLogins?.twitter}
          />
          <DataRow
            label="GITHUB"
            value={client?.socialLogins?.github ? "LOGGED IN" : "-"}
            highlight={!!client?.socialLogins?.github}
          />
        </DataCard>

        {/* Advertiser Extrapolation */}
        {client?.userProfile && (
          <DataCard
            title="MARKETING_PROFILE"
            icon="ADS"
            delay={1600}
            className="wide"
          >
            <div className="card-grid-2">
              <DataRow
                label="HUMAN SCORE"
                value={client.userProfile.humanScore + "%"}
                highlight={client.userProfile.humanScore > 80}
              />
              <DataRow
                label="FRAUD RISK"
                value={client.userProfile.fraudRiskScore + "%"}
                highlight={client.userProfile.fraudRiskScore > 50}
              />
              <DataRow
                label="DEVICE VALUE"
                value={client.userProfile.estimatedDeviceValue}
              />
              <DataRow
                label="DEVICE AGE"
                value={client.userProfile.deviceAge}
              />
              <DataRow
                label="DEVELOPER"
                value={client.userProfile.likelyDeveloper ? "YES" : "NO"}
              />
              <DataRow
                label="GAMER"
                value={client.userProfile.likelyGamer ? "YES" : "NO"}
              />
              <DataRow
                label="TECH SAVVY"
                value={client.userProfile.likelyTechSavvy ? "YES" : "NO"}
              />
              <DataRow
                label="PRIVACY CONSCIOUS"
                value={client.userProfile.privacyConscious ? "YES" : "NO"}
              />
            </div>
          </DataCard>
        )}
      </div>
    </div>
  );
};
