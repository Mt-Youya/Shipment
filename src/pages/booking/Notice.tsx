import React from "react";

interface NoticeProps {
  // 可以根据需要添加属性
}

const Notice: React.FC<NoticeProps> = () => {
  return (
    <div>
      <h3 style={{ color: "red", marginBottom: "10px" }}>注意事项</h3>
      <ol
        style={{
          padding: "20px",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "8px"
        }}
      >
        <li style={{ marginBottom: "8px", color: "#555" }}>
          托运单是托运货物、安排运输和出具提单的依据，各项内容必须认真填写。
        </li>
        <li style={{ marginBottom: "8px", color: "#555" }}>
          货物的各项资料：唛头、件数和英文包装单位、中英文货名、重量、尺码等必须填全。
        </li>
        <li style={{ marginBottom: "8px", color: "#555" }}>运费与附加费栏，默认按双方协议价。</li>
        <li style={{ marginBottom: "8px", color: "#555" }}>
          可否转船、可否分批，未说明的一律视作可转船、可分批；运费预付、到付栏不填的，一律按预付处理；运输条款不填的，一律视作CY-CY条款；运费支付人不填的，托运人是当然的运费支付人。
        </li>
        <li style={{ marginBottom: "8px", color: "#555" }}>
          危险品托运，请订舱时告知，必须提供产品说明书，包装容器使用性能鉴定书。
        </li>
        <li style={{ marginBottom: "8px", color: "#555" }}>托运人一栏，必须由经办人签名及盖章。</li>
        <li style={{ marginBottom: "8px", color: "#555" }}>
          因托运单填写错误或资料不全引起的货物不能及时出运、运错目的地、提单错误不能结汇，不能提货等而产生的一切责任、风险、纠纷、费用等概由托运人承担。
        </li>
        <li style={{ marginBottom: "8px", color: "#555" }}>
          顺欣达作为货运代理人，对于运输过程中货物异常（破损、丢货、少货、卡车转运延误等）没有赔偿的义务，因此我司强烈建议所有出口货物均提前购买保险，以减少可能产生损失的风险，我司可以协助客户向船司提出索赔，索赔不得影响运费的正常支付，不得以索赔为由扣压运费！！
        </li>
      </ol>
    </div>
  );
};

export default Notice;
