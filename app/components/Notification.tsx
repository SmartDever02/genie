'use client'

export default function Noti() {
  const process = () => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
      // Request permission from the user
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          const window = (global.window as any)
          // Create a notification
          new Notification("Epoch Report", {
            body: `
            My top prompt score: ${window?.my_miner_top_score?.toFixed(3)} => ${window?.my_miner_top_score_uid}(#${window?.my_miner_top_score_grade})
My avg prompt score: ${window?.my_avg_score?.toFixed(3)}(#${window?.my_avg_score_grade})
My top performance: ${window?.my_top_miner_performance?.toFixed(3)} => ${window?.my_top_miner_uid}(#${window?.my_top_miner_grade})
My avg performance: ${window?.my_avg_performance?.toFixed(3)}(${Number(window?.my_avg_performance_grade)})
Miners not working: ${(window as any)?.bad_miners?.length || "Everything is fine"}
Reward: ${Number((window as any)?.total_daily).toFixed(1)} alpha t`,
            icon: "https://example.com/icon.png",
            requireInteraction: true,
          });
        }
      });
    }
  }

  const startNotificationHandler = () => {
    process();
    setInterval(process, 4_800_000);
  }
  
  return (
    <div className="pt-10">
      <button className="bg-white p-3 rounded-full text-black" onClick={startNotificationHandler}>Start Notification</button>
    </div>
  );
}